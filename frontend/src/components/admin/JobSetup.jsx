import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetJobById from '@/hooks/useGetJobById';
import ReactQuill from 'react-quill';
import useGetCompanyById from '@/hooks/useGetCompanyById';

import 'react-quill/dist/quill.snow.css';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

const JobSetup = () => {
    const params = useParams();
    const singleJob = useGetJobById(params.id); // Sử dụng hook để lấy dữ liệu công việc
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
        companyId: '',
        position: 0,
        postingDate: '',
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
    const { companies, singleCompany } = useSelector((store) => store.company);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    useGetCompanyById(selectedCompanyId);

    // Cập nhật dữ liệu khi singleJob thay đổi
    useEffect(() => {
        if (singleJob) {
            setJobInput({
                title: singleJob.title || '',
                location: singleJob.location || '',
                salaryType: singleJob.salaryType || 'Enter',
                salary: singleJob.salary || '',
                description: singleJob.description || '',
                requirements: singleJob.requirements || '',
                education: singleJob.education || '',
                experienceLevel: singleJob.experienceLevel || '',
                jobLevel: singleJob.jobLevel || '',
                gender: singleJob.gender || '',
                industry: singleJob.industry || '',
                age: singleJob.age || '',
                jobType: singleJob.jobType || '',
                companyIntro: singleJob.companyIntro || '',
                employeeCount: singleJob.employeeCount || '',
                benefits: singleJob.benefits || [''],
                companyId: singleJob.companyId || '',
                position: singleJob.position || 0,
                postingDate: singleJob.postingDate || '',
            });

            setContactInput({
                contactPerson: singleJob.contactPerson || '',
                contactPhone: singleJob.contactPhone || '',
                contactEmail: singleJob.contactEmail || '',
                workplace: singleJob.workplace || '',
                contactAddress: singleJob.contactAddress || '',
            });
        }
    }, [singleJob]);

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
                postingDate: jobInput.postingDate || new Date().toISOString().split('T')[0],
            };

            console.log("Payload sent to API:", payload);

            const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            } else {
                toast.error(res.data.message || "Job update failed!");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "An error occurred. Please try again!";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
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

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
                <form onSubmit={submitHandler}>
                    <div className="flex items-center gap-5 pb-6 border-b">
                        <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className="font-bold text-2xl">Edit Job</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Job Information */}
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
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={jobInput.title}
                                onChange={changeJobHandler}
                                placeholder="Enter job title"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={jobInput.location}
                                onChange={changeJobHandler}
                                placeholder="Enter job location"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Salary Type</Label>
                            <Select
                                onValueChange={(value) => selectChangeHandler(value, 'salaryType', 'job')}
                                value={jobInput.salaryType}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select salary type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['Enter', 'More', 'Negotiation', 'Competition'].map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {jobInput.salaryType === 'Enter' && (
                            <div>
                                <Label>Salary</Label>
                                <Input
                                    type="number"
                                    name="salary"
                                    value={jobInput.salary}
                                    onChange={changeJobHandler}
                                    placeholder="Enter salary"
                                    className="mt-1"
                                />
                            </div>
                        )}
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <ReactQuill
                                theme="snow"
                                value={jobInput.description}
                                onChange={(value) => handleQuillChange(value, 'description')}
                                placeholder="Enter job description"
                                className="bg-white rounded-md shadow-sm"
                                style={{ height: '200px', overflowY: 'auto' }}
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label>Requirements</Label>
                            <ReactQuill
                                theme="snow"
                                value={jobInput.requirements}
                                onChange={(value) => handleQuillChange(value, 'requirements')}
                                placeholder="Enter job requirements"
                                className="bg-white rounded-md shadow-sm"
                                style={{ height: '200px', overflowY: 'auto' }}
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                        <div>
                            <Label>Education</Label>
                            <Input
                                type="text"
                                name="education"
                                value={jobInput.education}
                                onChange={changeJobHandler}
                                placeholder="Enter education"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Select
                                onValueChange={(value) => selectChangeHandler(value, 'experienceLevel', 'job')}
                                value={jobInput.experienceLevel}
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
                        <div>
                            <Label>Job Level</Label>
                            <Input
                                type="text"
                                name="jobLevel"
                                value={jobInput.jobLevel}
                                onChange={changeJobHandler}
                                placeholder="Enter job level"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <Input
                                type="text"
                                name="gender"
                                value={jobInput.gender}
                                onChange={changeJobHandler}
                                placeholder="Enter gender"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Industry</Label>
                            <Input
                                type="text"
                                name="industry"
                                value={jobInput.industry}
                                onChange={changeJobHandler}
                                placeholder="Enter industry"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Age</Label>
                            <Input
                                type="text"
                                name="age"
                                value={jobInput.age}
                                onChange={changeJobHandler}
                                placeholder="Enter age"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={jobInput.jobType}
                                onChange={changeJobHandler}
                                placeholder="Enter job type"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Company Introduction</Label>
                            <Input
                                type="text"
                                name="companyIntro"
                                value={jobInput.companyIntro}
                                onChange={changeJobHandler}
                                placeholder="Enter company introduction"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Employee Count</Label>
                            <Input
                                type="text"
                                name="employeeCount"
                                value={jobInput.employeeCount}
                                onChange={changeJobHandler}
                                placeholder="Enter employee count"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={jobInput.position}
                                onChange={changeJobHandler}
                                placeholder="Enter position"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Posting Date</Label>
                            <Input
                                type="date"
                                name="postingDate"
                                value={jobInput.postingDate}
                                onChange={changeJobHandler}
                                placeholder="Enter posting date"
                                className="mt-1"
                            />
                        </div>
                        {/* Benefits */}
                        <div className="col-span-2">
                            <Label>Benefits</Label>
                            {jobInput.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-4 mt-2">
                                    <Input
                                        type="text"
                                        placeholder={`Benefit ${index + 1}`}
                                        value={benefit}
                                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                                    />
                                    {index > 0 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeBenefit(index)}
                                        >
                                            Delete
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
                                Add Benefit
                            </Button>
                        </div>
                        {/* Contact Information */}
                        <div>
                            <Label>Contact Person</Label>
                            <Input
                                type="text"
                                name="contactPerson"
                                value={contactInput.contactPerson}
                                onChange={changeContactHandler}
                                placeholder="Enter contact person"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Contact Phone</Label>
                            <Input
                                type="text"
                                name="contactPhone"
                                value={contactInput.contactPhone}
                                onChange={changeContactHandler}
                                placeholder="Enter contact phone"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Contact Email</Label>
                            <Input
                                type="email"
                                name="contactEmail"
                                value={contactInput.contactEmail}
                                onChange={changeContactHandler}
                                placeholder="Enter contact email"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Workplace</Label>
                            <Input
                                type="text"
                                name="workplace"
                                value={contactInput.workplace}
                                onChange={changeContactHandler}
                                placeholder="Enter workplace"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Contact Address</Label>
                            <Input
                                type="text"
                                name="contactAddress"
                                value={contactInput.contactAddress}
                                onChange={changeContactHandler}
                                placeholder="Enter contact address"
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        {
                            loading ? <Button className="w-full"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full">Update</Button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobSetup;