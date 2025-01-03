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
import { useSelector } from 'react-redux';

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
        companyIntro: '', // Giới thiệu công ty
        employeeCount: '',
        benefits: [''], // Tối đa 10 phúc lợi
        companyId: '', position: 0
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
    const { companies } = useSelector((store) => store.company);

    // Xử lý thay đổi input cho job
    const changeJobHandler = (e) => {
        const { name, value } = e.target;
        setJobInput({ ...jobInput, [name]: value });
    };

    // Xử lý thay đổi input cho contact
    const changeContactHandler = (e) => {
        const { name, value } = e.target;
        setContactInput({ ...contactInput, [name]: value });
    };

    // Xử lý thay đổi select (dropdown)
    const selectChangeHandler = (value, field, formType) => {
        const selectedCompany = companies.find(
            (company) => company.name.toLowerCase() === value.toLowerCase()
        );
        if (selectedCompany) {
            setJobInput({ ...jobInput, companyId: selectedCompany._id });
        }
        if (formType === 'job') {
            setJobInput({ ...jobInput, [field]: value });
        } else if (formType === 'contact') {
            setContactInput({ ...contactInput, [field]: value });
        }
    };

    // Xử lý thay đổi phúc lợi
    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...jobInput.benefits];
        updatedBenefits[index] = value.trim(); // Loại bỏ khoảng trắng thừa
        setJobInput({ ...jobInput, benefits: updatedBenefits });
    };

    // Thêm phúc lợi
    const addBenefit = () => {
        if (jobInput.benefits.length < 10) {
            setJobInput({ ...jobInput, benefits: [...jobInput.benefits, ''] });
        } else {
            toast.error('Only add up to 10 benefits!');
        }
    };

    // Xóa phúc lợi
    const removeBenefit = (index) => {
        const updatedBenefits = jobInput.benefits.filter((_, i) => i !== index);
        setJobInput({ ...jobInput, benefits: updatedBenefits });
    };

    // Xử lý submit form
    const submitHandler = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu trước khi gửi
        if (!jobInput.title.trim() || !contactInput.contactPerson.trim() || !contactInput.contactEmail.trim()) {
            toast.error("Please fill in all required fields!");
            return;
        }

        // Xử lý giá trị salary
        const salary = jobInput.salary ? parseFloat(jobInput.salary) : null; // Chuyển đổi sang số hoặc null

        if (isNaN(salary)) {
            toast.error("Invalid salary!");
            return;
        }

        const experienceMapping = {
            "0-1 years experience": 0,
            "1-2 years experience": 1,
            "2-5 years experience": 2,
            "5-10 years experience": 3,
            "Over 10 years experience": 4,
        };

        // Kiểm tra mức kinh nghiệm
        const experienceLevel = experienceMapping[jobInput.experienceLevel] || null;

        if (experienceLevel === null) {
            toast.error("Invalid experience!");
            return;
        }


        try {
            setLoading(true);

            // Chuẩn bị payload
            const payload = {
                ...jobInput,
                ...contactInput,
                salary: salary || "Thỏa thuận",
                experienceLevel, // Gửi giá trị đã được chuẩn hóa
                description: jobInput.description || "No description",
                requirements: jobInput.requirements || "No requirements",
                benefits: jobInput.benefits.filter((benefit) => benefit.trim() !== ""),
            };

            console.log("Payload sent to API:", payload);

            // Gửi dữ liệu qua API
            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            // Kiểm tra phản hồi từ server
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            } else {
                toast.error(res.data.message || "Job posting failed!");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "An error occurred. Please try again!";
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
                    <h2 className="text-xl font-bold mb-4">Job information</h2>
                    {companies.length > 0 ? (
                        <Select onValueChange={selectChangeHandler}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select company" />
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
                            There are no companies to choose from.
                        </p>
                    )}

                    {/* Chức danh và địa điểm */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={jobInput.title}
                                onChange={changeJobHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
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
                        <Label>Number of employees*</Label>
                        <Select
                            onValueChange={(value) =>
                                selectChangeHandler(value, 'employeeCount', 'job')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select number of employees" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {['Less 10', '25-99', '100-499'].map((count) => (
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
                        <Label >Company Introduction</Label>
                        <textarea
                            name="companyIntro"
                            value={jobInput.companyIntro}
                            onChange={changeJobHandler}
                            placeholder="Enter company information"
                            className="w-full border rounded-lg p-2"
                            rows="5"
                        />
                    </div>


                    {/* Lương */}
                    <div className="mt-4">
                        <Label>Lương*</Label>
                        <div className="flex items-center gap-4">
                            {['Enter', 'More', 'Negotiation', 'Competition'].map((type) => (
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

                        {/* Hiển thị form nhập tiền nếu chọn "Nhập" */}
                        {jobInput.salaryType === 'Enter' && (
                            <div className="mt-2">
                                <Label>Enter salary</Label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={jobInput.salary}
                                    onChange={changeJobHandler}
                                    placeholder="Enter salary (VND)"
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <Label>Job Description*</Label>

                        <textarea
                            name="description"
                            value={jobInput.description}
                            onChange={changeJobHandler}
                            placeholder="Enter job description"
                            rows="5"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div className="mt-2">

                        <Label>Job Requirements*</Label>

                        <textarea
                            name="requirements"
                            value={jobInput.requirements}
                            onChange={changeJobHandler}
                            placeholder="Enter job requirements"
                            rows="5"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    {/* Phúc lợi */}
                    <div className="mt-4">
                        <Label>Benefits (maximum 10)</Label>
                        {jobInput.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-4 mt-2">
                                <Input
                                    type="text"
                                    placeholder={`Benefits ${index + 1}`}
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
                                        Erase
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
                            More benefits
                        </Button>
                    </div>

                    <hr className="my-6 border-gray-300" />

                    <h2 className="text-xl font-bold mb-4">Job Details</h2>
                    <div className="grid grid-cols-2 gap-4">


                        {/* Trình độ học vấn */}
                        <div>
                            <Label>Education level*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'education', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Junior High School',
                                            'High school',
                                            'Certificate',
                                            'Intermediate',
                                            'College',
                                            'Bachelor',
                                            'Engineer',
                                            'Master',
                                            'Master of Arts',
                                            'Master of Commerce',
                                            'Master of Science',
                                            'Master of Architecture',
                                            'Master of Business Administration',
                                            'Master of Applied Engineering',
                                            'Master of Laws',
                                            'Master of Medicine',
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
                            <Label>Experience level*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'experienceLevel', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            '0-1 years experience',
                                            '1-2 years experience',
                                            '2-5 years experience',
                                            '5-10 years experience',
                                            'Over 10 years experience',
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
                            <Label>Rank*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'jobLevel', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Student / Intern',
                                            'New to work',
                                            'Staff',
                                            'Technician / Engineer',
                                            'Team Leader / Supervisor',
                                            'Manager / Department Head',
                                            'Manager',
                                            'Senior Management',
                                            'Senior Executive',
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
                            <Label>Job Type*</Label>
                            <Select
                                onValueChange={(value) =>
                                    selectChangeHandler(value, 'jobType', 'job')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Full-time employee',
                                            'Temporary full-time employee',
                                            'Part-time employee',
                                            'Temporary part-time employee',
                                            'Contract employee',
                                            'Other',
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
                                    <SelectValue placeholder="Select gender" />
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
                                    <SelectValue placeholder="Choose a career" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Quality Management (QA/QC)',
                                            'Executive Management',
                                            'Advertising / Promotion / Public Relations',
                                            'Production / Production Operations',
                                            'Finance / Investment',
                                            'Fashion',
                                            'Seafood',
                                            'Secretary / Administration',
                                            'Marketing',
                                            'Advise',
                                            'Transportation / Traffic / Warehousing',
                                            'Materials / Purchasing',
                                            'Telecommunications',
                                            'Build',
                                            'Import and Export / Foreign Trade',
                                            'Other',
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
                                    <SelectValue placeholder="Select age" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['Not required', 'Above', 'Below', 'Enter'].map((age) => (
                                            <SelectItem key={age} value={age}>
                                                {age}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Number of positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={jobInput.position} // Sử dụng jobInput.position
                                onChange={changeJobHandler} // Sử dụng hàm changeJobHandler
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                    </div>

                    <hr className="my-6 border-gray-300" />

                    <h2 className="text-xl font-bold mb-4">Contact information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Contact person*</Label>
                            <Input
                                type="text"
                                name="contactPerson"
                                value={contactInput.contactPerson}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Contact phone</Label>
                            <Input
                                type="text"
                                name="contactPhone"
                                value={contactInput.contactPhone}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Contact Email*</Label>
                            <Input
                                type="email"
                                name="contactEmail"
                                value={contactInput.contactEmail}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Workplace*</Label>
                            <Input
                                type="text"
                                name="workplace"
                                value={contactInput.workplace}
                                onChange={changeContactHandler}
                            />
                        </div>
                        <div>
                            <Label>Contact address</Label>
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
                            {loading ? 'Posting...' : 'Post a job'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;