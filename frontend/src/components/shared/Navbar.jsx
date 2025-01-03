import React from 'react';
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

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className='bg-gray-100 shadow-md'>
            <div className='flex items-center justify-between px-6 max-w-7xl mx-auto h-16'>
                <div>
                    <h1 className='text-2xl font-bold text-blue-600'>Recruit <span className='text-red-500'> Employ</span></h1>
                </div>
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-6'>
                        {user && user.role === 'recruiter' ? (
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
                        )}
                    </ul>
                    {!user ? (
                        <div className='flex items-center gap-3'>
                            <Link to="/login"><Button variant="outline">Log in</Button></Link>
                            <Link to="/signup"><Button className="bg-blue-600 hover:bg-blue-500">Register</Button></Link>
                        </div>
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
