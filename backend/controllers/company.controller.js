import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        // In ra req.body để kiểm tra dữ liệu
        console.log(req.body);
        
        const {
            companyName,
            description,
            location,
            employeeCount,
            contactPerson,
            businessType,
            phone,
            email,
            workplace,
            industry,
        } = req.body;

        // Kiểm tra nếu tên công ty không được cung cấp
        if (!companyName || typeof companyName !== 'string' || companyName.trim() === '') {
            return res.status(400).json({
                message: "Tên công ty là bắt buộc.",
                success: false,
            });
        }

        // Kiểm tra nếu công ty đã tồn tại
        let company = await Company.findOne({ companyName: companyName.trim() });
        if (company) {
            return res.status(400).json({
                message: "Bạn không thể đăng ký công ty giống nhau.",
                success: false,
            });
        }

        // Xử lý file upload (nếu có)
        let logo = null;
        if (req.file) {
            // Chuyển file thành Data URI
            const fileUri = getDataUri(req.file);

            // Upload file lên Cloudinary
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "company_logos", // Tạo folder trên Cloudinary
                resource_type: "image", // Đảm bảo chỉ upload ảnh
            });

            // Lấy URL của ảnh từ Cloudinary
            logo = cloudResponse.secure_url;
        }

        // Tạo mới công ty trong database
        company = await Company.create({
            companyName: companyName.trim(),
            description,
            location,
            employeeCount,
            contactPerson,
            businessType,
            phone,
            email,
            workplace,
            industry,
            logo, // Lưu URL logo (nếu có)
            userId: req.id, // ID của người dùng đăng ký công ty
        });

        return res.status(201).json({
            message: "Công ty đã được đăng ký thành công.",
            company,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi đăng ký công ty.",
            success: false,
        });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        // Tìm tất cả các công ty có isActive là "active"
        const companies = await Company.find({ isActive: "active" });

        // Kiểm tra nếu không có công ty nào được tìm thấy
        if (companies.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy công ty nào.",
                success: false
            });
        }

        // Trả về danh sách công ty nếu tìm thấy
        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty:", error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy danh sách công ty.",
            success: false
        });
    }
};
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // ID người dùng đã đăng nhập
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Lấy công ty theo ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Công ty không tìm thấy.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;
 
        const file = req.file;
        // Ở đây sẽ là cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
    
        const updateData = { companyName, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Công ty không tìm thấy.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Thông tin công ty đã được cập nhật.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}