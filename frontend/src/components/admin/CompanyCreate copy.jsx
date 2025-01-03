import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State for form fields
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [employeeCount, setEmployeeCount] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [avatarFile, setAvatarFile] = useState(null); // Store file instead of URL
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [industry, setIndustry] = useState('');

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const registerNewCompany = async () => {
        try {
            const formData = new FormData();
            formData.append('companyName', companyName);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('employeeCount', employeeCount);
            formData.append('contactPerson', contactPerson);
            formData.append('businessType', businessType);
            formData.append('avatar', avatarFile); // Send avatar file
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('workplace', workplace);
            formData.append('industry', industry);

            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while registering the company.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md">
                <div className="mb-8 text-center">
                    <h1 className="font-bold text-3xl text-gray-800">Create New Company</h1>
                    <p className="text-gray-500">Provide detailed information about your company. You can edit it later.</p>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div>
                        <Label>Company Name</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="JobHunt, Microsoft, etc."
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <Label>Location</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="Company office address"
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Employee Count */}
                    <div>
                        <Label>Employee Count</Label>
                        <Input
                            type="number"
                            className="mt-2"
                            placeholder="Example: 50, 100, 200"
                            onChange={(e) => setEmployeeCount(e.target.value)}
                        />
                    </div>

                    {/* Contact Person */}
                    <div>
                        <Label>Contact Person</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="Name of the contact person"
                            onChange={(e) => setContactPerson(e.target.value)}
                        />
                    </div>

                    {/* Business Type */}
                    <div>
                        <Label>Business Type</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="Example: Technology, Commerce, Manufacturing"
                            onChange={(e) => setBusinessType(e.target.value)}
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div>
                        <Label>Company Avatar</Label>
                        <Input
                            type="file"
                            className="mt-2"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>

                    {/* Contact Phone */}
                    <div>
                        <Label>Contact Phone</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="Contact phone number"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* Contact Email */}
                    <div>
                        <Label>Contact Email</Label>
                        <Input
                            type="email"
                            className="mt-2"
                            placeholder="Contact email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Workplace */}
                    <div>
                        <Label>Workplace</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="Example: Hanoi, Ho Chi Minh City"
                            onChange={(e) => setWorkplace(e.target.value)}
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <Label>Industry</Label>
                        <Input
                            type="text"
                            className="mt-2"
                            placeholder="Example: Information Technology, Healthcare, Education"
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                    </div>
                </div>

                {/* Company Description */}
                <div className="mt-6">
                    <Label>Company Description</Label>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        placeholder="Enter a brief introduction about your company"
                        className="mt-2"
                    />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-4 mt-8">
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>
                        Cancel
                    </Button>
                    <Button onClick={registerNewCompany}>
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;