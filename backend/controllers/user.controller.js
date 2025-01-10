import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Hàm đăng ký người dùng
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Kiểm tra thông tin đầu vào
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Please check the information again.",
                success: false,
            });
        }

        // Kiểm tra file upload
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Profile photo is required.",
                success: false,
            });
        }

        // Xử lý file upload với Cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // Kiểm tra xem email đã tồn tại chưa
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "A user already exists with this email.",
                success: false,
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Xác định trạng thái isActive dựa trên role
        let isActive = "pending"; // Mặc định là 'pending'
        if (role === "student") {
            isActive = "active"; // Nếu là 'student', đặt là 'active'
        }

        // Tạo người dùng mới
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            isActive, // Thêm trạng thái isActive
            profile: {
                profilePhoto: cloudResponse.secure_url,
            },
        });

        // Phản hồi tùy thuộc vào vai trò
        if (role === "recruiter") {
            return res.status(201).json({
                message: "Account created successfully. Your account is pending approval.",
                success: true,
            });
        }

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body; // Thêm trường role từ request body

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác." });
        }

        // Kiểm tra role của email đăng nhập có khớp với role được gửi lên không
        if (user.role !== role) {
            return res.status(403).json({
                message: `Email này có role là ${user.role}, không thể đăng nhập với role ${role}.`,
            });
        }

        // Kiểm tra mật khẩu
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác." });
        }

        // Tạo token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Payload
            process.env.JWT_SECRET, // Secret key
            { expiresIn: "1d" } // Thời gian hết hạn
        );

        // Trả về thông tin người dùng và token
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role, // Trả về role của người dùng
                profile: user.profile,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive,

            },
            token,
        });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// Hàm đăng xuất người dùng
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Log out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Hàm cập nhật hồ sơ người dùng
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file; // Lấy tệp từ yêu cầu

        let cloudResponse;
        if (file) {
            // Nếu có tệp, tải lên Cloudinary
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // Lấy ID người dùng từ middleware xác thực
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        // Cập nhật dữ liệu người dùng
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Nếu có tệp, cập nhật thông tin resume
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Lưu URL của Cloudinary
            user.profile.resumeOriginalName = file.originalname; // Lưu tên tệp gốc
        }

        await user.save();

        // Chuẩn bị dữ liệu trả về
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false,
        });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id; // Lấy ID người dùng từ middleware xác thực
        // Tìm người dùng dựa trên userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Kiểm tra xem người dùng đã có CV (resume) hay chưa
        const hasResume = user.profile && user.profile.resume;

        if (hasResume) {
            return res.status(200).json({
                message: "User profile information.",
                success: true,
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    profile: {
                        bio: user.profile.bio,
                        skills: user.profile.skills,
                        resume: user.profile.resume, // URL của CV
                        resumeOriginalName: user.profile.resumeOriginalName // Tên gốc của tệp CV
                    }
                }
            });
        } else {
            return res.status(200).json({
                message: "User has not uploaded CV yet.",
                success: false,
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    profile: {
                        bio: user.profile.bio,
                        skills: user.profile.skills,
                        resume: null, // Không có CV
                        resumeOriginalName: null // Không có tên gốc của tệp CV
                    }
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while retrieving user information.",
            success: false
        });
    }
};
