import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for React Quill

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        companyName: "",
        description: "",
        location: "",
        employeeCount: "",
        contactPerson: "",
        businessType: "",
        phone: "",
        email: "",
        workplace: "",
        industry: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const handleDescriptionChange = (value) => {
        setInput({ ...input, description: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('companyName', input.companyName);
        formData.append('description', input.description);
        formData.append('location', input.location);
        formData.append('employeeCount', input.employeeCount);
        formData.append('contactPerson', input.contactPerson);
        formData.append('businessType', input.businessType);
        formData.append('phone', input.phone);
        formData.append('email', input.email);
        formData.append('workplace', input.workplace);
        formData.append('industry', input.industry);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            companyName: singleCompany.companyName || "",
            description: singleCompany.description || "",
            location: singleCompany.location || "",
            employeeCount: singleCompany.employeeCount || "",
            contactPerson: singleCompany.contactPerson || "",
            businessType: singleCompany.businessType || "",
            phone: singleCompany.phone || "",
            email: singleCompany.email || "",
            workplace: singleCompany.workplace || "",
            industry: singleCompany.industry || "",
            file: singleCompany.file || null
        });
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 pb-6 border-b'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-2xl'>Edit Company</h1>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="companyName"
                                value={input.companyName}
                                onChange={changeEventHandler}
                                placeholder="Enter company name"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="Enter company address"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Employee Count</Label>
                            <Input
                                type="text"
                                name="employeeCount"
                                value={input.employeeCount}
                                onChange={changeEventHandler}
                                placeholder="Enter number of employees"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Contact Person</Label>
                            <Input
                                type="text"
                                name="contactPerson"
                                value={input.contactPerson}
                                onChange={changeEventHandler}
                                placeholder="Enter contact person name"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Business Type</Label>
                            <Input
                                type="text"
                                name="businessType"
                                value={input.businessType}
                                onChange={changeEventHandler}
                                placeholder="Enter business type"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input
                                type="text"
                                name="phone"
                                value={input.phone}
                                onChange={changeEventHandler}
                                placeholder="Enter phone number"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Enter email address"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Workplace</Label>
                            <Input
                                type="text"
                                name="workplace"
                                value={input.workplace}
                                onChange={changeEventHandler}
                                placeholder="Enter workplace"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Industry</Label>
                            <Input
                                type="text"
                                name="industry"
                                value={input.industry}
                                onChange={changeEventHandler}
                                placeholder="Enter industry"
                                className="mt-1"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <ReactQuill
                                value={input.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter company description"
                                className="mt-1 bg-white"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
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
}

export default CompanySetup;