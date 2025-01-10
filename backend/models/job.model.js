import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [
            {
                type: String,
            },
        ],
        salary: {
            type: Number,
            required: true,
        },
        salaryType: {
            type: String, // Ví dụ: "Nhập" hoặc "Thỏa thuận"
            required: true,
        },
        experienceLevel: {
            type: Number,
            required: true, // 0: Không yêu cầu, 1: Dưới 1 năm, 2: 1-2 năm, ...
        },
        location: {
            type: String,
            required: true,
        },
        jobType: {
            type: String, // Ví dụ: "Nhân viên toàn thời gian cố định"
            required: true,
        },
        position: {
            type: Number, // Mã định danh cho vị trí công việc
            required: true,
        },
        workplace: {
            type: String, // Ví dụ: "Văn phòng công ty"
        },
        education: {
            type: String, // Ví dụ: "Trung học cơ sở", "Đại học"
        },
        jobLevel: {
            type: String, // Ví dụ: "Sinh viên / Thực tập sinh", "Nhân viên"
        },
        gender: {
            type: String, // Ví dụ: "Nam", "Nữ", "Không yêu cầu"
        },
        industry: {
            type: String, // Ví dụ: "Thư ký / Hành chánh"
        },
        age: {
            type: String, // Ví dụ: "Không yêu cầu", "22-35"
        },
        companyIntro: {
            type: String, // Mô tả giới thiệu về công ty
        },
        employeeCount: {
            type: String, // Ví dụ: "25-99", "100-499"
        },
        benefits: [
            {
                type: String, // Ví dụ: "Bảo hiểm", "Du lịch hàng năm"
            },
        ],
        contactPerson: {
            type: String, // Tên người liên hệ
            required: true,
        },
        contactPhone: {
            type: String, // Số điện thoại liên hệ
            required: true,
        },
        contactEmail: {
            type: String, // Email liên hệ
            required: true,
        },
        contactAddress: {
            type: String, // Địa chỉ liên hệ
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application",
            },
        ],
         isActive: {
        type: String,
        enum: ['pending', 'active', 'deleted', 'blocked'],
        default: 'active'
    },
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
