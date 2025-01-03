import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Loại bỏ khoảng trắng thừa
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    employeeCount: {
        type: String, // Hoặc có thể sử dụng `Number` nếu muốn lưu dưới dạng số
    },
    contactPerson: {
        type: String,
    },
    businessType: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    workplace: {
        type: String,
    },
    industry: {
        type: String,
    },
    logo: {
        type: String, // URL to company logo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);