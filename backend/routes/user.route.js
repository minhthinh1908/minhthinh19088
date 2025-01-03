import express from "express";
import { login, logout, register, updateProfile, getUserProfile } from "../controllers/user.controller.js"; // Thêm `getUserProfile`
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Route đăng ký tài khoản
router.route("/register").post(singleUpload, register);

// Route đăng nhập
router.route("/login").post(login);

// Route đăng xuất
router.route("/logout").get(logout);

// Route cập nhật hồ sơ người dùng
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

// Route lấy thông tin hồ sơ người dùng
router.route("/profile").get(isAuthenticated, getUserProfile); // Thêm route mới

export default router;
