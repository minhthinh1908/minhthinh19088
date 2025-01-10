import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token") || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })        }

        // Kiểm tra xem token có trong danh sách đen không
        const isBlacklisted = await TokenBlacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token đã bị thu hồi." });
        }

        // Xác thực token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.user = decoded;
        req.id = decoded.userId;

        next();
    } catch (error) {
        console.log(error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token không hợp lệ." });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token đã hết hạn." });
        }

        res.status(500).json({ message: "Lỗi server." });
    }
};

// Middleware kiểm tra role admin
export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Bạn không có quyền truy cập.",
            success: false,
        });
    }
    next();
};