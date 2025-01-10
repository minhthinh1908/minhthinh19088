import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Navbar from "../shared/Navbar";
import { Loader2 } from "lucide-react";
import Alert from "../ui/swal";
import axios from "axios";
import { ADMIN_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const AdminLogin = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "admin", // Mặc định role là admin
    });
    const { loading } = useSelector((store) => store.auth); // Lấy trạng thái loading từ Redux
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Kiểm tra nếu người dùng đã đăng nhập, chuyển hướng đến trang dashboard
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true)); // Bật trạng thái loading
        try {
            const res = await axios.post(`${ADMIN_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true, // Cho phép gửi cookie
            });

            if (res.data.success) {
                localStorage.setItem("token", res.data.token); // Lưu token vào localStorage
                dispatch(setUser(res.data.user)); // Lưu thông tin người dùng vào Redux
                navigate("/admin/dashboard"); // Chuyển hướng đến trang dashboard
                Alert.success(res.data.message); // Hiển thị thông báo thành công
            } else {
                Alert.error(res.data.message); // Hiển thị thông báo lỗi từ server
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            if (error.response && error.response.data.message) {
                Alert.error(error.response.data.message); // Hiển thị thông báo lỗi từ server
            } else {
                Alert.error("Lỗi server. Vui lòng thử lại sau.");
            }
        } finally {
            dispatch(setLoading(false)); // Tắt trạng thái loading
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
                    <h1 className="font-bold text-xl mb-5">Log in Administrator</h1>
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Please enter email"
                            required
                        />
                    </div>

                    <div className="my-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Please enter password"
                            required
                        />
                    </div>

                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Log in
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;