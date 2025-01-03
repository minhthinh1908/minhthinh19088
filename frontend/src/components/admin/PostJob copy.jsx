import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const PostJob = () => {
    const [jobInput, setJobInput] = useState({
        title: '',
        location: '',
        salaryType: 'Thương lượng',
        salary: '',
        description: '',
        requirements: '',
        education: '',
        experienceLevel: '',
        jobLevel: '',
        gender: '',
        industry: '',
        age: '',
        jobType: '',
        benefits: ['',], // Tối đa 10 phúc lợi
    });

    const [contactInput, setContactInput] = useState({
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        workplace: '',
        contactAddress: '',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeJobHandler = (e) => {
        setJobInput({ ...jobInput, [e.target.name]: e.target.value });
    };

    const changeContactHandler = (e) => {
        setContactInput({ ...contactInput, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value, field, formType) => {
        if (formType === 'job') {
            setJobInput({ ...jobInput, [field]: value });
        } else if (formType === 'contact') {
            setContactInput({ ...contactInput, [field]: value });
        }
    };

    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...jobInput.benefits];
        updatedBenefits[index] = value;
        setJobInput({ ...jobInput, benefits: updatedBenefits });
    };
    const addBenefit = () => {
        if (jobInput.benefits.length < 10) {
            setJobInput({ ...jobInput, benefits: [...jobInput.benefits, ''] });
        } else {
            toast.error('Chỉ được thêm tối đa 10 phúc lợi!');
        }
    };

    const removeBenefit = (index) => {
        const updatedBenefits = jobInput.benefits.filter((_, i) => i !== index);
        setJobInput({ ...jobInput, benefits: updatedBenefits });
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                `${JOB_API_END_POINT}/post`,
                { ...jobInput, ...contactInput },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
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

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-6">

                <form onSubmit={submitHandler} className="p-8 bg-white rounded-lg shadow-lg border">
                    <h2 className="text-xl font-bold mb-4">Thông tin công việc</h2>

                    {/* Chức danh và địa điểm */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Chức danh</Label>
                            <Input
                                type="text"
                                name="title"
                                value={jobInput.title}
                                onChange={changeJobHandler}
                            />
                        </div>
                        <div>
                            <Label>Địa điểm</Label>
                            <Input
                                type="text"
                                name="location"
                                value={jobInput.location}
                                onChange={changeJobHandler}
                            />
                        </div>
                    </div>

                    {/* Số nhân viên */}
                    <div className="mt-4">
                        <Label>Số nhân viên*</Label>
                        <Select
                            onValueChange={(value) =>
                                selectChangeHandler(value, 'employeeCount', 'job')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn số nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {['Ít hơn 10', '25-99', '100-499'].map((count) => (
                                        <SelectItem key={count} value={count}>
                                            {count}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Giới thiệu công ty */}
                    <div className="mt-4">
                        <Label>Giới thiệu công ty</Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={jobInput.companyIntro}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setJobInput({ ...jobInput, companyIntro: data });
                            }}
                        />
                        
                    </div>

                    {/* Lương */}
                    <div className="mt-4">
                        <Label>Lương*</Label>
                        <div className="flex items-center gap-4">
                            {['Nhập', 'Hơn', 'Thương lượng', 'Cạnh tranh'].map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="salaryType"
                                        value={type}
                                        checked={jobInput.salaryType === type}
                                        onChange={changeJobHandler}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Phúc lợi */}
                    <div className="mt-4">
                        <Label>Phúc lợi (tối đa 10)</Label>
                        {jobInput.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-4 mt-2">
                                <Input
                                    type="text"
                                    placeholder={`Phúc lợi ${index + 1}`}
                                    value={benefit}
                                    onChange={(e) =>
                                        handleBenefitChange(index, e.target.value)
                                    }
                                />
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeBenefit(index)}
                                    >
                                        Xóa
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            className="mt-4"
                            onClick={addBenefit}
                            disabled={jobInput.benefits.length >= 10}
                        >
                            Thêm phúc lợi
                        </Button>
                    </div>

                    <hr className="my-6 border-gray-300" />

                    <h2 className="text-xl font-bold mb-4">Chi tiết công việc</h2>
                    <div className="grid grid-cols-2 gap-4">


                        {/* Trình độ học vấn */}
                        <div>
                            <Label>Trình độ học vấn*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'education', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn trình độ học vấn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Trung học cơ sở',
                                            'Trung học phổ thông',
                                            'Chứng chỉ',
                                            'Trung cấp',
                                            'Cao đẳng',
                                            'Cử nhân',
                                            'Kỹ sư',
                                            'Thạc sĩ',
                                            'Thạc sĩ Nghệ thuật',
                                            'Thạc sĩ Thương mại',
                                            'Thạc sĩ Khoa học',
                                            'Thạc sĩ Kiến trúc',
                                            'Thạc sĩ QTKD',
                                            'Thạc sĩ Kỹ thuật ứng dụng',
                                            'Thạc sĩ Luật',
                                            'Thạc sĩ Y học',
                                        ].map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mức kinh nghiệm */}
                        <div>
                            <Label>Mức kinh nghiệm*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'experienceLevel', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn mức kinh nghiệm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            '0-1 năm kinh nghiệm',
                                            '1-2 năm kinh nghiệm',
                                            '2-5 năm kinh nghiệm',
                                            '5-10 năm kinh nghiệm',
                                            'Hơn 10 năm kinh nghiệm',
                                        ].map((exp) => (
                                            <SelectItem key={exp} value={exp}>
                                                {exp}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cấp bậc */}
                        <div>
                            <Label>Cấp bậc*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'jobLevel', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn cấp bậc" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Sinh viên / Thực tập sinh',
                                            'Mới đi làm',
                                            'Nhân viên',
                                            'Kỹ thuật viên / Kỹ sư',
                                            'Trưởng nhóm / Giám sát',
                                            'Quản lý / Trưởng phòng',
                                            'Giám đốc',
                                            'Quản lý cấp cao',
                                            'Điều hành cấp cao',
                                        ].map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Loại công việc */}
                        <div>
                            <Label>Loại công việc*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'jobType', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại công việc" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Nhân viên toàn thời gian',
                                            'Nhân viên toàn thời gian tạm thời',
                                            'Nhân viên bán thời gian',
                                            'Nhân viên bán thời gian tạm thời',
                                            'Nhân viên hợp đồng',
                                            'Khác',
                                        ].map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Giới tính */}
                        <div>
                            <Label>Giới tính*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'gender', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['Nam', 'Nữ'].map((gender) => (
                                            <SelectItem key={gender} value={gender}>
                                                {gender}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ngành nghề */}
                        <div>
                            <Label>Ngành nghề*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'industry', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn ngành nghề" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Quản lý chất lượng (QA / QC)',
                                            'Quản lý điều hành',
                                            'Quảng cáo / Khuyến mãi / Đối ngoại',
                                            'Sản xuất / Vận hành sản xuất',
                                            'Tài chính / Đầu tư',
                                            'Thời trang',
                                            'Thuỷ Hải Sản',
                                            'Thư ký / Hành chánh',
                                            'Tiếp thị',
                                            'Tư vấn',
                                            'Vận chuyển / Giao thông / Kho bãi',
                                            'Vật tư / Thu mua',
                                            'Viễn Thông',
                                            'Xây dựng',
                                            'Xuất nhập khẩu / Ngoại thương',
                                            'Khác',
                                        ].map((industry) => (
                                            <SelectItem key={industry} value={industry}>
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tuổi */}
                        <div>
                            <Label>Tuổi*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'age', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn tuổi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['Không yêu cầu', 'Trên', 'Dưới', 'Nhập'].map((age) => (
                                            <SelectItem key={age} value={age}>
                                                {age}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-300" />

                    <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Người liên hệ*</Label>
                            <Input
                                type="text"
                                name="contactPerson"
                                value={contactInput.contactPerson}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Điện thoại liên lạc</Label>
                            <Input
                                type="text"
                                name="contactPhone"
                                value={contactInput.contactPhone}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Email liên hệ*</Label>
                            <Input
                                type="email"
                                name="contactEmail"
                                value={contactInput.contactEmail}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Nơi làm việc*</Label>
                            <Input
                                type="text"
                                name="workplace"
                                value={contactInput.workplace}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Địa điểm liên hệ</Label>
                            <Input
                                type="text"
                                name="contactAddress"
                                value={contactInput.contactAddress}
                                onChange={changeContactHandler}
                            />
                        </div>
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
            </div>
        </div>
    );
};

export default PostJob;