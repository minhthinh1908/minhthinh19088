import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import Alert from '../ui/swal'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Xử lý thay đổi giá trị input
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Xử lý thay đổi file
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    // Hàm kiểm tra dữ liệu đầu vào
    const validateInput = () => {
        if (!input.fullname) {
            Alert.warning("The 'First and Last Name' field cannot be left blank!");
            return false;
        }
        if (!input.email) {
            Alert.warning("The 'Email' field cannot be empty!");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(input.email)) {
            Alert.warning("Invalid email! Please enter a valid email format.");
            return false;
        }
        if (!input.phoneNumber) {
            Alert.warning("The 'Phone Number' field cannot be left blank!");
            return false;
        }
        if (!/^\d{10,11}$/.test(input.phoneNumber)) {
            Alert.warning("Invalid phone number! Please enter correct format (10-11 digits).");
            return false;
        }
        if (!input.password) {
            Alert.warning("The 'Password' field cannot be left blank!");
            return false;
        }
        if (input.password.length < 6) {
            Alert.warning("Password must be at least 6 characters!");
            return false;
        }
        if (!input.role) {
            Alert.warning("Please select a role!");
            return false;
        }
        if (!input.file) {
            Alert.warning("Please upload an avatar!");
            return false;
        }
        return true;
    };
    

    // Xử lý submit form
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validateInput()) return;

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                navigate("/login");
                Alert.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.error(error.response?.data?.message || "Đã xảy ra lỗi!");
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Điều hướng nếu đã đăng nhập
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
                    <h1 className="font-bold text-xl mb-5">Đăng ký</h1>

                    {/* Họ và tên */}
                    <div className="my-2">
                        <Label>Full name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Please enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Phone number"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div className="my-2">
                        <Label>Phone number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Please enter phone number"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="my-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Please enter password"
                        />
                    </div>

                    {/* Vai trò */}
                    <div className="flex items-center justify-between">
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center gap-x-2">
                                <Input
                                    id="r1"
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === "student"}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label htmlFor="r1" className="cursor-pointer">
                                    Student
                                </Label>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <Input
                                    id="r2"
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === "recruiter"}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label htmlFor="r2" className="cursor-pointer">
                                    Employer
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Ảnh đại diện */}
                    <div className="flex items-center gap-x-4">
                        <Label htmlFor="avatar" className="whitespace-nowrap">
                            Avatar (optional)
                        </Label>
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={changeFileHandler}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Nút đăng ký */}
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Đăng ký
                        </Button>
                    )}

                    {/* Liên kết đến trang đăng nhập */}
                    <span className="text-sm">
                        Đã có tài khoản? <Link to="/login" className="text-blue-600">Log in</Link>
                    </span>
                </form>
            </div>
        </div>
    );
};


export default Signup