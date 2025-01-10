import React, { useEffect, useState } from "react";
import { getUser, logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Alert from "../ui/swal";
import Navbar from "../shared/Navbar";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
    const user = useSelector((state) => state.auth.user); // Lấy thông tin người dùng từ Redux store
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/"); // Chuyển hướng đến trang đăng nhập nếu không có token
            return;
        }

        if (user) {
            if (user.role !== "admin") {
                navigate("/"); // Chuyển hướng đến trang chủ nếu người dùng không phải admin
            } else {
                navigate("/admin/dashboard"); // Cho phép truy cập trang admin nếu người dùng là admin
            }
        }
    }, [user, navigate]); // Theo dõi sự thay đổi của `user` và `navigate`


    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-100 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold">Tổng số người dùng</h3>
                        <p className="text-3xl mt-2">100</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold">Tổng số công việc</h3>
                        <p className="text-3xl mt-2">50</p>
                    </div>
                    <div className="bg-yellow-100 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold">Tổng số công ty</h3>
                        <p className="text-3xl mt-2">20</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
