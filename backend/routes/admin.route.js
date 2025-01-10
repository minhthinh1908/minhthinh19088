import express from "express";
import {
    login,
    logout,
    getUsers,
    getUserDetails,
    toggleUserStatus,
    deleteUser,
    createJob,
    getJobs,
    getJobDetails,
    updateJob,
    deleteJob,
    toggleJobStatus,
    acp,
    createCompany,
    getCompanies,
    getCompanyDetails,
    updateCompany,
    deleteCompany,
    toggleCompanyStatus,
} from "../controllers/admin.controller.js";
import { adminMiddleware, isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Route đăng nhập và đăng xuất
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

// Route quản lý người dùng
router.get("/users", isAuthenticated, adminMiddleware, getUsers); // Lấy danh sách người dùng
router.get("/users/:id", isAuthenticated, adminMiddleware, getUserDetails); // Lấy thông tin chi tiết người dùng
router.put("/users/:id/toggle-status", isAuthenticated, adminMiddleware, toggleUserStatus); // Khóa/mở khóa tài khoản
router.put("/users/:id/acp", isAuthenticated, adminMiddleware, acp); // Duyệt tài khoản
router.delete("/users/:id", isAuthenticated, adminMiddleware, deleteUser); // Xóa tài khoản

// Route quản lý công việc
router.post("/jobs", isAuthenticated, adminMiddleware, createJob); // Tạo công việc mới
router.get("/jobs", isAuthenticated, adminMiddleware, getJobs); // Lấy danh sách công việc
router.get("/jobs/:id", isAuthenticated, adminMiddleware, getJobDetails); // Lấy thông tin chi tiết công việc
router.put("/jobs/:id", isAuthenticated, adminMiddleware, updateJob); // Cập nhật công việc
router.delete("/jobs/:id", isAuthenticated, adminMiddleware, deleteJob); // Xóa công việc
router.put("/jobs/:id/status", isAuthenticated, adminMiddleware, toggleJobStatus); // Thay đổi trạng thái công việc

// Route quản lý công ty
router.post("/companies", isAuthenticated, adminMiddleware, createCompany); // Tạo công ty mới
router.get("/companies", isAuthenticated, adminMiddleware, getCompanies); // Lấy danh sách công ty
router.get("/companies/:id", isAuthenticated, adminMiddleware, getCompanyDetails); // Lấy thông tin chi tiết công ty
router.put("/companies/:id", isAuthenticated, adminMiddleware, updateCompany); // Cập nhật công ty
router.delete("/companies/:id", isAuthenticated, adminMiddleware, deleteCompany); // Xóa công ty
router.put("/companies/:id/status", isAuthenticated, adminMiddleware, toggleCompanyStatus); // Thay đổi trạng thái công việc

// Route dashboard
router.get("/dashboard", isAuthenticated, adminMiddleware, (req, res) => {
    res.status(200).json({ message: "Chào mừng đến trang quản trị." });
});

export default router;