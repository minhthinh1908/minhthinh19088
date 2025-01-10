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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import Alert from '../ui/swal'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Hàm kiểm tra tính hợp lệ của dữ liệu nhập
    const validateInput = () => {
        const { email, password, role } = input;

        // Kiểm tra email
        if (!email) {
            Alert.error("Email is required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.error("Invalid email format.");
            return false;
        }

        // Kiểm tra mật khẩu
        if (!password) {
            Alert.error("Password is required.");
            return false;
        }
        if (password.length < 6) {
            Alert.error("Password must be at least 6 characters long.");
            return false;
        }

        // Kiểm tra vai trò
        if (!role) {
            Alert.error("Role is required.");
            return false;
        }
        if (!["student", "recruiter"].includes(role)) {
            Alert.error("Invalid role. Please select either 'student' or 'recruiter'.");
            return false;
        }

        return true; // Dữ liệu hợp lệ
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ của dữ liệu nhập
        if (!validateInput()) {
            return; // Nếu không hợp lệ, dừng việc gửi yêu cầu
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                localStorage.setItem('token', res.data.token)
                Alert.success(res.data.message);
            } else {
                Alert.error(res.data.message);
            }
        } catch (error) {
            // Xử lý lỗi từ server
            if (error.response) {
                const { status, data } = error.response;

                // Kiểm tra mã lỗi 403
                if (status === 403) {
                    Alert.warning(data.message || "You do not have permission to log in.");
                } else {
                    Alert.error(data.message || "An error occurred while logging in.");
                }
            } else {
                // Xử lý lỗi không phải từ server (lỗi mạng, lỗi kết nối, v.v.)
                console.log(error);
                Alert.error("An unexpected error occurred. Please try again later.");
            }
        } finally {
            dispatch(setLoading(false));
        }

    };


    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Log in</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Please enter email"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Please enter password"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center gap-x-2">
                                <Input
                                    id="r1"
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label htmlFor="r1" className="cursor-pointer">
                                    Candidate
                                </Label>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <Input
                                    id="r2"
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label htmlFor="r2" className="cursor-pointer">
                                    Recruiter
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait... </Button> : <Button type="submit" className="w-full my-4">Log in</Button>
                    }
                    <span className='text-sm'>No account yet? <Link to="/signup" className='text-blue-600'>Register</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login