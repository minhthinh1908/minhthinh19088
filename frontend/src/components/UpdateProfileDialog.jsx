import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import CSS của React Quill
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '', // React Quill sẽ thay thế phần này
        skills: user?.profile?.skills?.join(', ') || '',
        file: user?.profile?.resume || '',
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio); // Lấy dữ liệu từ React Quill
        formData.append('skills', input.skills);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open}>
                <DialogContent
                    className="sm:max-w-[600px] bg-white rounded-lg shadow-lg"
                    onInteractOutside={() => setOpen(false)}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800">
                            Update profile
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className="grid gap-6 py-4">
                            {/* Full Name */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fullname" className="text-right text-gray-600">
                                    Name
                                </Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>

                            {/* Email */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right text-gray-600">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phoneNumber" className="text-right text-gray-600">
                                    Phone number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="bio" className="text-right text-gray-600">
                                    Introduce yourself
                                </Label>
                                <div className="col-span-3">
                                    <ReactQuill
                                        theme="snow"
                                        value={input.bio} // Giá trị ban đầu
                                        onChange={(value) => {
                                            setInput({ ...input, bio: value }); // Cập nhật state
                                        }}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline', 'strike'], // Text styling
                                                [{ header: [1, 2, 3, false] }], // Headers
                                                [{ list: 'ordered' }, { list: 'bullet' }], // Lists
                                                ['link', 'image'], // Links and Images
                                                ['clean'], // Clear formatting
                                            ],
                                        }}
                                        formats={[
                                            'header',
                                            'bold',
                                            'italic',
                                            'underline',
                                            'strike',
                                            'list',
                                            'bullet',
                                            'link',
                                            'image',
                                        ]}
                                        className="bg-white rounded-md shadow-sm"
                                        style={{
                                            height: '200px', // Tăng chiều cao lên 200px
                                            overflowY: 'auto', // Thêm cuộn dọc nếu nội dung vượt quá chiều cao
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="skills" className="text-right text-gray-600">
                                    Skill
                                </Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    placeholder="Ngăn cách bằng dấu phẩy (,)"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>

                            {/* File Upload */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="file" className="text-right text-gray-600">
                                    File (Resume)
                                </Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                )}
                                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UpdateProfileDialog;
