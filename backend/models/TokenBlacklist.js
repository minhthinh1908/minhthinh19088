import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true }, // Token đã hết hiệu lực
    createdAt: { type: Date, default: Date.now, expires: "7d" } // Tự động xóa sau 7 ngày
});

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);