import React, { useEffect, useState } from 'react';
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import kiểu dáng mặc định của React Quill
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const PostJob = () => {
    const [jobInput, setJobInput] = useState({
        title: '',
        location: '',
        salaryType: 'Enter',
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
        companyIntro: '',
        employeeCount: '',
        benefits: [''],
        companyId: '', position: 0,
        postingDate: '', // Thêm trường postingDate

    });

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"], // Xóa định dạng
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
    ];

    const [contactInput, setContactInput] = useState({
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        workplace: '',
        contactAddress: '',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies, singleCompany } = useSelector((store) => store.company);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    useGetCompanyById(selectedCompanyId);

    const selectChangeHandler = (value, field, formType) => {
        const selectedCompany = companies.find(
            (company) => company.companyName?.toLowerCase() === value.toLowerCase()
        );

        if (selectedCompany) {
            setSelectedCompanyId(selectedCompany._id);
            setJobInput((prev) => ({ ...prev, companyId: selectedCompany._id }));
        }

        if (formType === 'job') {
            setJobInput((prev) => ({ ...prev, [field]: value }));
        } else if (formType === 'contact') {
            setContactInput((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleQuillChange = (value, field) => {
        setJobInput((prev) => ({ ...prev, [field]: value }));
    };

    const changeJobHandler = (e) => {
        const { name, value } = e.target;
        setJobInput((prev) => ({ ...prev, [name]: value }));
    };

    const changeContactHandler = (e) => {
        const { name, value } = e.target;
        setContactInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...jobInput.benefits];
        updatedBenefits[index] = value.trim();
        setJobInput((prev) => ({ ...prev, benefits: updatedBenefits }));
    };

    const addBenefit = () => {
        if (jobInput.benefits.length < 10) {
            setJobInput((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }));
        } else {
            toast.error('Only add up to 10 benefits!');
        }
    };

    const removeBenefit = (index) => {
        const updatedBenefits = jobInput.benefits.filter((_, i) => i !== index);
        setJobInput((prev) => ({ ...prev, benefits: updatedBenefits }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!jobInput.title.trim() || !contactInput.contactPerson.trim() || !contactInput.contactEmail.trim()) {
            toast.error("Please fill in all required fields!");
            return;
        }

        const salary = jobInput.salary ? parseFloat(jobInput.salary) : null;

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

        const experienceLevel = experienceMapping[jobInput.experienceLevel] || null;

        if (experienceLevel === null) {
            toast.error("Invalid experience!");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...jobInput,
                ...contactInput,
                salary: salary || "Agree",
                experienceLevel,
                description: jobInput.description || "No description",
                requirements: jobInput.requirements || "No requirements",
                benefits: jobInput.benefits.filter((benefit) => benefit.trim() !== ""),
                postingDate: jobInput.postingDate || new Date().toISOString().split('T')[0], // Mặc định là ngày hiện tại nếu không có giá trị

            };

            console.log("Payload sent to API:", payload);

            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

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

    // useEffect(() => {
    //     setContactInput({
    //         companyName: singleCompany.companyName || "",
    //         description: singleCompany.description || "",
    //         location: singleCompany.location || "",
    //         employeeCount: singleCompany.employeeCount || "",
    //         contactPerson: singleCompany.contactPerson || "",
    //         businessType: singleCompany.businessType || "",
    //         phone: singleCompany.phone || "",
    //         email: singleCompany.email || "",
    //         workplace: singleCompany.workplace || "",
    //         industry: singleCompany.industry || "",
    //         file: singleCompany.file || null
    //     });
    // }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className="max-w mx-auto my-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
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
                                                    value={company?.companyName?.toLowerCase()}
                                                >
                                                    {company.companyName}
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
                                <Label>Company Introduction</Label>
                                <ReactQuill
                                    theme="snow"
                                    value={singleCompany?.description || ""} // Sử dụng singleCompany.description
                                    onChange={handleQuillChange}
                                    placeholder="Enter company information"
                                    className="bg-white rounded-md shadow-sm"
                                    style={{
                                        height: '200px', // Tăng chiều cao lên 200px
                                        overflowY: 'auto', // Thêm cuộn dọc nếu nội dung vượt quá chiều cao
                                    }}
                                    modules={modules} // Thêm modules
                                    formats={formats} // Thêm formats
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
                                        <Label>Nhập mức lương</Label>
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
                                <ReactQuill
                                    theme="snow"
                                    value={jobInput.description}
                                    onChange={(value) => handleQuillChange(value, 'description')}
                                    placeholder="Enter job description"
                                    className="bg-white rounded-md shadow-sm"
                                    style={{
                                        height: '200px', // Tăng chiều cao
                                        overflowY: 'auto', // Thêm cuộn dọc
                                    }}
                                    modules={modules} // Sử dụng modules
                                    formats={formats} // Sử dụng formats
                                />
                            </div>

                            <div className="mt-2">
                                <Label>Job Requirements*</Label>
                                <ReactQuill
                                    theme="snow"
                                    value={jobInput.requirements}
                                    onChange={(value) => handleQuillChange(value, 'requirements')}
                                    placeholder="Enter job requirements"
                                    className="bg-white rounded-md shadow-sm"
                                    style={{
                                        height: '200px', // Tăng chiều cao
                                        overflowY: 'auto', // Thêm cuộn dọc
                                    }}
                                    modules={modules} // Sử dụng modules
                                    formats={formats} // Sử dụng formats
                                />
                            </div>
                            {/* Phúc lợi */}
                            <div className="mt-4">
                                <Label>Benefits (up to 10)</Label>
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
                                                delete
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

                            <h2 className="text-xl font-bold mb-4">Chi tiết công việc</h2>
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
                                    <Label>Cấp bậc*</Label>
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
                                                {['Male', 'Female'].map((gender) => (
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
                                    <Label>Industry*</Label>
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
                                    <Label>Year old*</Label>
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
                                                {['Not required', 'Above', 'Below',].map((age) => (
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
                                        value={jobInput.position}
                                        onChange={changeJobHandler}
                                        className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                    />
                                </div>
                                <div>
                                    <Label>Date posted*</Label>
                                    <Input
                                        type="date"
                                        name="postingDate"
                                        value={jobInput.postingDate}
                                        onChange={changeJobHandler}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <hr className="my-6 border-gray-300" />

                            <h2 className="text-xl font-bold mb-4">Contact information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Contact Person*</Label>
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
                                        value={contactInput?.phone}
                                        onChange={changeContactHandler}
                                    />
                                </div>
                                <div>
                                    <Label>Contact Email*</Label>
                                    <Input
                                        type="email"
                                        name="contactEmail"
                                        value={contactInput?.email}
                                        onChange={changeContactHandler}
                                    />
                                </div>
                                <div>
                                    <Label>Place of work*</Label>
                                    <Input
                                        type="text"
                                        name="workplace"
                                        value={contactInput?.workplace}
                                        onChange={changeContactHandler}
                                    />
                                </div>
                                <div>
                                    <Label>Contact address</Label>
                                    <Input
                                        type="text"
                                        name="contactAddress"
                                        value={contactInput?.location}
                                        onChange={changeContactHandler}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : null}
                                    {loading ? 'Posting...' : 'Post job'}
                                </Button>
                            </div>
                        </form>
                    </div>
                    {/* Phần bên phải: Xem trước công việc */}
                    <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Job Preview</h2>
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <h1 className="text-4xl font-bold">{jobInput.title || 'Job Title'}</h1>
                                    <div className="flex items-center gap-3 mt-4">
                                        <span className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                            {jobInput.position || 0} Location
                                        </span>
                                        <span className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
                                            {jobInput.jobType || 'Job Type'}
                                        </span>
                                        <span className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg">
                                            {jobInput.salaryType === 'Enter' && jobInput.salary
                                                ? `${jobInput.salary} VND`
                                                : jobInput.salaryType || 'Enter'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin chi tiết */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                            <h3 className="text-lg font-bold">Job Description</h3>
                            <p className="text-gray-700 mt-2">
                                {jobInput.description || 'No job description yet.'}
                            </p>

                            <h3 className="text-lg font-bold mt-4">Job Requirements</h3>
                            <p className="text-gray-700 mt-2">
                                {jobInput.requirements || 'No job requirements yet.'}
                            </p>

                            <h3 className="text-lg font-bold mt-4">Benefits</h3>
                            <ul className="list-disc list-inside text-gray-700 mt-2">
                                {jobInput.benefits.filter((benefit) => benefit.trim() !== '').length > 0
                                    ? jobInput.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))
                                    : 'Chưa có phúc lợi.'}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;