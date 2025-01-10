import React, { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { logout } from "../../services/authService";
import Alert from '../ui/swal';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();


    useEffect(() => {
        const interval = setInterval(() => {
            if (user && user.isActive === 'block') {
                Alert.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.');

                dispatch(setUser(null));
                localStorage.clear();

                // Chuyển hướng về trang chủ
                navigate("/login");
            }
        }, 100); // Kiểm tra mỗi 5 giây

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(interval);
    }, [user, navigate]);

    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                localStorage.clear();
                // Xóa token khỏi localStorage

                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    const handleLogout = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            if (token) {
                await logout(token); // Gọi API đăng xuất
            }
            dispatch(setUser(null));
            localStorage.clear();
            // Xóa token khỏi localStorage
            navigate("/admin/login"); // Chuyển hướng đến trang đăng nhập
            Alert.success("Đăng xuất thành công");
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };
    return (
        <div className="bg-gray-100 shadow-md">
            <div className="flex items-center justify-between px-6 max-w-7xl mx-auto h-16">
                <Link to="/">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Recruit <span className="text-red-500">Employ</span>
                    </h1>
                </Link>
                <div className="flex items-center gap-8">
                    <ul className="flex font-medium items-center gap-6">
                        {user ? (
                            user.role === "admin" ? (
                                <div className="flex items-center gap-4">
                                    <ul className="flex items-center gap-4">
                                        <li>
                                            <Link
                                                className={`block px-4 py-2 rounded-md transition-all duration-300 ease-in-out ${location.pathname === "/admin/users"
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                                    }`}
                                                to="/admin/users"
                                            >
                                                User Management
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className={`block px-4 py-2 rounded-md transition-all duration-300 ease-in-out ${location.pathname === "/admin/job"
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                                    }`}
                                                to="/admin/job"
                                            >
                                                Job Management
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className={`block px-4 py-2 rounded-md transition-all duration-300 ease-in-out ${location.pathname === "/admin/companies"
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                                    }`}
                                                to="/admin/companies"
                                            >
                                                Company Management
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                            ) : user.role === 'recruiter' ? (
                                <>
                                    <li><Link className='hover:text-blue-500' to="/admin/companies">Company</Link></li>
                                    <li><Link className='hover:text-blue-500' to="/admin/jobs">Job</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link className='hover:text-blue-500' to="/">Home</Link></li>
                                    <li><Link className='hover:text-blue-500' to="/jobs">Job</Link></li>
                                    <li><Link className='hover:text-blue-500' to="/browse">Discover</Link></li>
                                </>
                            )
                        ) : (
                            <>
                                <li><Link className='hover:text-blue-500' to="/">Home</Link></li>
                                <li><Link className='hover:text-blue-500' to="/jobs">Job</Link></li>
                                <li><Link className='hover:text-blue-500' to="/browse">Discover</Link></li>
                            </>
                        )}
                    </ul>
                    {!user ? (
                        <div className='flex items-center gap-3'>
                            <Link to="/login"><Button variant="outline">Log in</Button></Link>
                            <Link to="/signup"><Button className="bg-blue-600 hover:bg-blue-500">Register</Button></Link>
                        </div>
                    ) : user.role === 'admin' ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="Avatar" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <div className='p-4'>
                                    <div className='flex gap-3 items-center'>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="Avatar" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-semibold'>{user?.fullname}</h4>
                                        </div>
                                    </div>
                                    <div className='mt-4 space-y-2 text-gray-600'>
                                        <div className='flex items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={handleLogout} variant="link">Log out</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="Avatar" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <div className='p-4'>
                                    <div className='flex gap-3 items-center'>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="Avatar" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-semibold'>{user?.fullname}</h4>
                                        </div>
                                    </div>
                                    <div className='mt-4 space-y-2 text-gray-600'>
                                        {user && user.role === 'student' && (
                                            <div className='flex items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button variant="link"><Link to="/profile">Personal profile</Link></Button>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Log out</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
