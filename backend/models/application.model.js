import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Number, // Sử dụng số để biểu diễn trạng thái
        enum: [0, 1, 2, 3, 4, 5], // Các trạng thái hợp lệ
        default: 0 // Mặc định là "Pending" (0)
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Cho phép lưu trữ bất kỳ loại dữ liệu nào (object, string, v.v.)
        default: {} // Mặc định là một object rỗng
    }
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);
