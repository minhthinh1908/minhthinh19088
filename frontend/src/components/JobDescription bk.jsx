import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT,USER_API_END_POINT  } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Alert from './ui/swal';

const JobDescription = () => {
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(
        (application) => application.applicant === user?._id
    ) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            // Gọi API để kiểm tra xem người dùng đã tải lên CV hay chưa
            const profileRes = await axios.get(`${USER_API_END_POINT}/profile`, {
                withCredentials: true,
            });
    
            const userProfile = profileRes.data.user;
            console.log(profileRes.data.success)
            // Kiểm tra nếu người dùng chưa tải lên CV
            if (!profileRes.data.success) {
                Alert.error(`You need to upload your CV before applying!`);
                
                return;
            }
            
            // Nếu đã có CV, tiếp tục apply công việc
            Alert.error(`You need to upload your CV before applying!`);
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
                withCredentials: true,
            });
    
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...singleJob.applications, { applicant: user?._id }],
                };
                dispatch(setSingleJob(updatedSingleJob));
                Alert.success(res.data.message || "An error occurred!");

            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred!");
        }
    };
    
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(
                        res.data.job.applications.some(
                            (application) => application.applicant === user?._id
                        )
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h1 className="text-4xl font-bold">{singleJob?.title}</h1>
                            <div className="flex items-center gap-3 mt-4">
                                <Badge className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    {singleJob?.position} Vị trí
                                </Badge>
                                <Badge className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
                                    {singleJob?.jobType}
                                </Badge>
                                <Badge className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg">
                                    {formatCurrency(singleJob?.salary)}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`rounded-lg px-6 py-3 text-lg ${
                                    isApplied
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-white text-purple-700 hover:bg-purple-100 transition duration-300'
                                }`}
                            >
                                {isApplied ? 'Application Submitted' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Job Details Section */}
                <div className="bg-white rounded-lg shadow-lg mt-10 p-6">
                    <h1 className="text-2xl font-semibold border-b pb-4">Job Details</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h2 className="font-bold text-lg">Location:</h2>
                            <p className="text-gray-700">{singleJob?.title}</p>
                            <h2 className="font-bold text-lg mt-4">Location:</h2>
                            <p className="text-gray-700">{singleJob?.location}</p>
                            <h2 className="font-bold text-lg mt-4">Wage:</h2>
                            <p className="text-gray-700">{formatCurrency(singleJob?.salary)}</p>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Job Description:</h2>
                            <p className="text-gray-700">{singleJob?.description}</p>
                            <h2 className="font-bold text-lg mt-4">Experience required:</h2>
                            <p className="text-gray-700">{singleJob?.experienceLevel} year</p>
                            <h2 className="font-bold text-lg mt-4">Number of candidates:</h2>
                            <p className="text-gray-700">{singleJob?.applications?.length || 0} People</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;