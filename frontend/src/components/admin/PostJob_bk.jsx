import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector((store) => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find(
            (company) => company.name.toLowerCase() === value
        );
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return 'Chưa nhập';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Form nhập thông tin */}
                    <form
                        onSubmit={submitHandler}
                        className="p-8 bg-white rounded-lg shadow-lg border"
                    >
                        <h2 className="text-xl font-bold mb-4">Nhập thông tin công việc</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Tiêu đề</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Mô tả</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Yêu cầu</Label>
                                <Input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Mức lương</Label>
                                <Input
                                    type="text"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Địa điểm</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Loại công việc</Label>
                                <Input
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Kinh nghiệm</Label>
                                <Input
                                    type="text"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            <div>
                                <Label>Số lượng vị trí</Label>
                                <Input
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                />
                            </div>
                            {companies.length > 0 ? (
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn công ty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem
                                                    key={company._id}
                                                    value={company?.name?.toLowerCase()}
                                                >
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-gray-500 col-span-2">
                                    Không có công ty nào để chọn.
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" />
                                ) : null}
                                {loading ? 'Đang đăng...' : 'Đăng công việc'}
                            </Button>
                        </div>
                    </form>

                    {/* Xem trước nội dung */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h1 className="text-4xl font-bold">{input.title || 'Chưa nhập tiêu đề'}</h1>
                                <div className="flex items-center gap-3 mt-4">
                                    <span className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                        {input.position || 0} Vị trí
                                    </span>
                                    <span className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
                                        {input.jobType || 'Chưa nhập'}
                                    </span>
                                    <span className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg">
                                        {formatCurrency(input.salary)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg mt-10 p-6 text-black">
                            <h1 className="text-2xl font-semibold border-b pb-4">Chi Tiết Công Việc</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <h2 className="font-bold text-lg">Vị trí:</h2>
                                    <p className="text-gray-700">{input.title || 'Chưa nhập'}</p>
                                    <h2 className="font-bold text-lg mt-4">Địa điểm:</h2>
                                    <p className="text-gray-700">{input.location || 'Chưa nhập'}</p>
                                    <h2 className="font-bold text-lg mt-4">Lương:</h2>
                                    <p className="text-gray-700">{formatCurrency(input.salary)}</p>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">Mô tả công việc:</h2>
                                    <p className="text-gray-700">{input.description || 'Chưa nhập'}</p>
                                    <h2 className="font-bold text-lg mt-4">Kinh nghiệm yêu cầu:</h2>
                                    <p className="text-gray-700">{input.experience || 'Chưa nhập'} năm</p>
                                    <h2 className="font-bold text-lg mt-4">Yêu cầu:</h2>
                                    <p className="text-gray-700">{input.requirements || 'Chưa nhập'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
