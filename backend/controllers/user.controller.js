import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Hàm đăng ký người dùng
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Please check the information again.",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'A user already exists with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

// Hàm đăng nhập người dùng
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Please check the information again.",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email or password is incorrect.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Email or password is incorrect.",
                success: false,
            })
        };
        // kiểm tra vai trò có đúng không
        if (role !== user.role) {
            return res.status(400).json({
                message: "The account does not exist with the current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

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
