import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
export const createCompany = async (req, res) => {
    try {
        const { userId } = req.user; // Lấy userId từ token (đã được xác thực)
        const companyData = { ...req.body, userId }; // Thêm userId vào dữ liệu công ty

        const company = await Company.create(companyData);

        return res.status(201).json({
            success: true,
            message: "Công ty đã được tạo thành công.",
            data: company,
        });
    } catch (error) {
        console.error("Lỗi khi tạo công ty:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};

// Lấy danh sách công ty
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate("userId", "fullname email"); // Lấy thông tin người dùng liên quan
        return res.status(200).json({
            success: true,
            data: companies,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};

// Lấy thông tin chi tiết công ty
export const getCompanyDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id).populate("userId", "fullname email");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Công ty không tồn tại.",
            });
        }

        return res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};

// Cập nhật thông tin công ty
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByIdAndUpdate(id, req.body, { new: true });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Công ty không tồn tại.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Công ty đã được cập nhật thành công.",
            data: company,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật công ty:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};

// Xóa công ty
export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByIdAndDelete(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Công ty không tồn tại.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Công ty đã được xóa thành công.",
        });
    } catch (error) {
        console.error("Lỗi khi xóa công ty:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};
// Tạo công việc mới
export const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            salaryType,
            experienceLevel,
            location,
            jobType,
            position,
            workplace,
            education,
            jobLevel,
            gender,
            industry,
            age,
            companyIntro,
            employeeCount,
            benefits,
            contactPerson,
            contactPhone,
            contactEmail,
            contactAddress,
            company,
            created_by,
        } = req.body;

        // Kiểm tra xem công ty và người tạo có tồn tại không
        const companyExists = await Company.findById(company);
        const userExists = await User.findById(created_by);

        if (!companyExists || !userExists) {
            return res.status(400).json({ message: "Công ty hoặc người tạo không tồn tại." });
        }

        // Tạo công việc mới
        const newJob = new Job({
            title,
            description,
            requirements,
            salary,
            salaryType,
            experienceLevel,
            location,
            jobType,
            position,
            workplace,
            education,
            jobLevel,
            gender,
            industry,
            age,
            companyIntro,
            employeeCount,
            benefits,
            contactPerson,
            contactPhone,
            contactEmail,
            contactAddress,
            company,
            created_by,
        });

        // Lưu công việc vào database
        await newJob.save();

        res.status(201).json({ message: "Công việc được tạo thành công.", job: newJob });
    } catch (error) {
        console.error("Lỗi khi tạo công việc:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// Lấy danh sách công việc
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("company", "name") // Populate thông tin công ty
            .populate("created_by", "fullname email"); // Populate thông tin người tạo

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách công việc:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// Lấy thông tin chi tiết của một công việc
export const getJobDetails = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate("company", "name") // Populate thông tin công ty
            .populate("created_by", "fullname email") // Populate thông tin người tạo
            .populate("applications", "status appliedAt"); // Populate thông tin ứng tuyển

        if (!job) {
            return res.status(404).json({ message: "Không tìm thấy công việc." });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin công việc:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// Cập nhật thông tin công việc
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const updateData = req.body;

        // Kiểm tra xem công việc có tồn tại không
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Không tìm thấy công việc." });
        }

        // Cập nhật thông tin công việc
        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        res.status(200).json({ message: "Công việc được cập nhật thành công.", job: updatedJob });
    } catch (error) {
        console.error("Lỗi khi cập nhật công việc:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// Xóa công việc
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Kiểm tra xem công việc có tồn tại không
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Không tìm thấy công việc." });
        }

        // Xóa công việc
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({ message: "Công việc được xóa thành công." });
    } catch (error) {
        console.error("Lỗi khi xóa công việc:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
export const toggleJobStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { status } = req.body;

        // Kiểm tra tính hợp lệ của trạng thái
        const validStatuses = ['pending', 'active', 'deleted', 'blocked'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }

        // Kiểm tra xem công việc có tồn tại không
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Không tìm thấy công việc." });
        }

        // Cập nhật chỉ trường status, giữ nguyên các trường khác
        job.isActive = status;
        await job.save();

        res.status(200).json({ message: "Trạng thái công việc được cập nhật thành công.", job });
    } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái công việc:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
export const toggleCompanyStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        // Kiểm tra tính hợp lệ của trạng thái
        const validStatuses = ['pending', 'active', 'deleted', 'blocked'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }

        // Kiểm tra xem công việc có tồn tại không
        const job = await Company.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Không tìm thấy công ty." });
        }

        // Cập nhật chỉ trường status, giữ nguyên các trường khác
        job.isActive = status;
        await job.save();

        res.status(200).json({ message: "Trạng thái công ty được cập nhật thành công.", job });
    } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái công ty:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
export const getUsers = async (req, res) => {
    try {
        // Lấy toàn bộ người dùng từ cơ sở dữ liệu
        const users = await User.find().select("-password"); // Loại bỏ trường password

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};


// Lấy thông tin chi tiết của một người dùng
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại.",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};

// Khóa hoặc mở khóa tài khoản người dùng
export const acp = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ request params
        const user = await User.findById(id); // Tìm người dùng trong cơ sở dữ liệu

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại.",
            });
        }

        // Kiểm tra xem người dùng có đang ở trạng thái "pending" không
        if (user.isActive !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Chỉ có thể duyệt người dùng đang ở trạng thái chờ duyệt.",
            });
        }

        // Cập nhật trạng thái của người dùng thành "active"
        user.isActive = "active";
        await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

        // Trả về phản hồi thành công
        return res.status(200).json({
            success: true,
            message: "Tài khoản đã được duyệt thành công.",
            data: user,
        });
    } catch (error) {
        console.error("Lỗi khi duyệt tài khoản:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại.",
            });
        }

        // Chuyển đổi trạng thái giữa 'active' và 'blocked'
        if (user.isActive === 'active') {
            user.isActive = 'blocked';
        } else if (user.isActive === 'blocked') {
            user.isActive = 'active';
        } else {
            return res.status(400).json({
                success: false,
                message: "Trạng thái hiện tại không thể thay đổi.",
            });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: `Tài khoản đã được ${user.isActive === 'active' ? "mở khóa" : "khóa"}.`,
            data: user,
        });
    } catch (error) {
        console.error("Lỗi khi khóa/mở khóa tài khoản:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};


// Xóa tài khoản người dùng
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa tài khoản thành công.",
        });
    } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email không tồn tại.",
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không chính xác.",
            });
        }

        // Tạo token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        // Trả về thông tin người dùng và token
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
        });
    }
};

// Lấy thông tin người dùng (dashboard)
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
export const logout = async (req, res) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(400).json({ message: "Không có token được cung cấp." });
        }

        // Kiểm tra xem token đã hết hạn chưa
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Thêm token vào danh sách đen (blacklist)
        const blacklistedToken = new TokenBlacklist({ token });
        await blacklistedToken.save();

        res.status(200).json({ message: "Đăng xuất thành công." });
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token không hợp lệ." });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token đã hết hạn." });
        }

        res.status(500).json({ message: "Lỗi server." });
    }
};