import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Alert from './ui/swal';
import defaultBanner from '@/assets/default_banner_2.svg';
import { FaMoneyBillWave, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';
import { FiCode, FiBriefcase, FiUser, FiBook, FiClock, FiUsers, FiCalendar, FiLayers } from "react-icons/fi";
import InfoRow from './ui/InfoRow';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const JobDescription = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { singleCompany } = useSelector((store) => store.company);

    const { singleJob, jobs
        
     } = useSelector((store) => store.job);
    const formatPhoneNumber = (phone) => {
        if (!phone) return "";


        const cleaned = phone.replace(/\D/g, "");


        if (cleaned.startsWith("84")) {
            return "+84 " + cleaned.slice(2).replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
        } else if (cleaned.startsWith("0")) {
            return "+84 " + cleaned.slice(1).replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
        } else {
            return phone;
        }
    };
    const getEmployeeCountRange = (employeeCount) => {
        if (employeeCount <= 10) return "Ít hơn 10";
        if (employeeCount <= 20) return "10-20";
        if (employeeCount <= 40) return "20-40";
        if (employeeCount <= 60) return "40-60";
        if (employeeCount <= 80) return "60-80";
        if (employeeCount <= 100) return "80-100";
        if (employeeCount <= 200) return "100-200";
        if (employeeCount <= 500) return "200-500";
        return "More than 500";
    };
    const tabs = [
        { id: 0, label: "Describe" },
        { id: 1, label: "Required skills" },
        { id: 2, label: "Job Details" },
        { id: 3, label: "Contact" },
        { id: 4, label: "About the company" },
    ];

    const mapExperienceLevel = (value) => {
        switch (value) {
            case 0:
                return "0-1 years experience";
            case 1:
                return "1-2 years experience";
            case 2:
                return "2-5 years experience";
            case 3:
                return "5-10 years experience";
            case 4:
                return "Over 10 years experience";
            default:
                return "Unknown experience";
        }
    };

    const postingDate = singleJob?.postingDate || new Date().toISOString().split('T')[0];
    const timelineData = [
        {
            title: "Contact Name",
            content: singleJob?.contactPerson || "Information not provided",
            icon: <FaUser />,
            iconStyle: { background: '#e53935', color: '#fff' },
        },
        {
            title: "Phone",
            content: formatPhoneNumber(singleJob?.contactPhone),
            icon: <FaPhone />,
            iconStyle: { background: '#1e88e5', color: '#fff' },
        },
        {
            title: "Email",
            content: singleJob?.contactEmail,
            icon: <FaEnvelope />,
            iconStyle: { background: '#f57c00', color: '#fff' },
        },
        {
            title: "Address",
            content: singleJob?.contactAddress,
            icon: <FaMapMarkerAlt />,
            iconStyle: { background: '#43a047', color: '#fff' },
        },
        {
            title: "Note",
            content: "- Interested candidates can apply online, by email or directly to the company.",
            icon: <FaStickyNote />,
            iconStyle: { background: '#ffc107', color: '#fff' },
            contentStyle: { fontStyle: 'italic', color: '#757575' },
        },
    ];
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [isValid, setIsValid] = useState(false);


    const calculateDaysRemaining = (postingDate) => {
        const postDate = new Date(postingDate);
        const currentDate = new Date();


        const timeDifference = postDate.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));


        setDaysRemaining(daysDifference);


        setIsValid(daysDifference >= 0);
    };


    useEffect(() => {
        calculateDaysRemaining(postingDate);
    }, [postingDate]);
    const { user } = useSelector((store) => store.auth);
    const [isSaved, setIsSaved] = useState(false);
    const [iscompany, setCompany] = useState(null);

    useGetCompanyById(singleJob?.company);


    useGetAllJobs();


    useEffect(() => {
        console.log('Jobs:', jobs);
    }, [jobs]);

    const isInitiallyApplied =
        singleJob?.applications?.some((application) => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const handleSave = () => {
        setIsSaved(true);
        console.log("Job saved!");
    };


    const mockSimilarCompanies = [
        {
            id: 1,
            name: "Company TNHH transcosmos Vietnam",
            image: "https://blob-careerlinkvn.careerlink.vn/company_logos/1e04af10aeb179645e5620cc421a7ce2.png",
            location: "Hà Nội",
            salary: 20000000,
        },
        {
            id: 2,
            name: "Company CỔ PHẦN NÔNG NGHIỆP TRƯỜNG HẢI",
            image: "https://blob-careerlinkvn.careerlink.vn/company_logos/fd41ce8bc931dd6413fc2fd1194fb7a9.png",
            location: "Gia Lai",
            salary: 25000000,
        },
        {
            id: 3,
            name: "Company TNHH Dreamtech Việt Nam",
            image: "https://static.careerlink.vn/image/8513f13159a569b638e2b8799e351ba3",
            location: "Bắc Ninh",
            salary: 18000000,
        },
    ];

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const profileRes = await axios.get(`${USER_API_END_POINT}/profile`, {
                withCredentials: true,
            });

            const userProfile = profileRes.data.user;

            if (!profileRes.data.success) {
                Alert.error('You need to upload your CV before applying!');
                return;
            }

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
                toast.success(res.data.message || 'Application successful!');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'An error occurred!');
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    if (res.data.job.company) {
                        const companyResponse = await axios.get(`${JOB_API_END_POINT}/getlogo/${jobId}`, {
                            withCredentials: true,
                        });

                        setCompany(companyResponse.data.company);
                    }
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
    }, [jobId, dispatch, user]);
    const calculateRange = (salary) => {
        if (salary === null || salary === undefined) return { min: null, max: null };

        if (salary === 4000000) {
            return { min: 4000000, max: 10000000 };
        } else if (salary === 10000000) {
            return { min: 10000000, max: 20000000 };
        } else {
            return { min: salary, max: salary + 6000000 };
        }
    };

    const { min, max } = calculateRange(singleJob?.salary);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (

        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Navbar />

            <div className="max-w-7xl mx-auto my-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Column */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "20px",
                                padding: "20px",
                                backgroundImage: `url(${defaultBanner})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        >

                            <img
                                src={iscompany?.logo}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "5px",
                                    marginRight: "15px",
                                    border: "1px solid #ddd",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    objectFit: "cover",
                                }}
                            />

                            <div>
                                <h2
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        color: "#333",
                                        marginBottom: "5px",
                                    }}
                                >
                                    {singleJob?.title}
                                </h2>
                                <p style={{ fontSize: "14px", color: "#000" }}>{singleJob?.jobType}</p>
                            </div>
                        </div>


                        <div style={{ marginBottom: "20px" }}>
                            {/* Địa điểm */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", fontSize: "14px", color: "#555" }}>
                                <FaMapMarkerAlt style={{ marginRight: "10px", fontSize: "16px", color: "#555" }} />
                                <span>{singleJob?.location}</span>
                            </div>

                            {/* Mức lương */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", fontSize: "14px", color: "#555" }}>
                                <FaMoneyBillWave style={{ marginRight: "10px", fontSize: "16px", color: "#555" }} />
                                <span>{formatCurrency(min)} - {formatCurrency(max)}</span>
                            </div>

                            {/* Kinh nghiệm */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", fontSize: "14px", color: "#555" }}>
                                <FaClock style={{ marginRight: "10px", fontSize: "16px", color: "#555" }} />
                                <span>{singleJob?.experienceLevel} years of experience</span>
                            </div>

                            {/* Ngày đăng tuyển */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", fontSize: "14px", color: "#555" }}>
                                <FaCalendarAlt style={{ marginRight: "10px", fontSize: "16px", color: "#555" }} />
                                <span>Ngày đăng tuyển: {postingDate} | Expires in: {daysRemaining >= 0 ? daysRemaining : 'Đã hết hạn'} next day | Status: {isValid ? 'Still valid' : 'Expired'}</span>

                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "20px" }}>
                            {/* Nút Nộp Đơn */}
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`rounded-lg px-6 py-3 text-lg font-medium transition duration-300 mb-4 ${isApplied
                                    ? 'bg-gray-600 text-white cursor-not-allowed'
                                    : 'bg-purple-700 text-white hover:bg-purple-800'
                                    }`}
                            >
                                {isApplied ? 'Application Submitted' : 'Apply Now'}
                            </Button>

                            {/* Nút Wish */}
                            <Button
                                onClick={handleSave}
                                disabled={isSaved}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 20px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    borderRadius: "5px",
                                    border: isSaved ? "1px solid #cccccc" : "1px solid #007bff",
                                    backgroundColor: isSaved ? "#f5f5f5" : "#ffffff",
                                    color: isSaved ? "#666666" : "#007bff",
                                    cursor: isSaved ? "not-allowed" : "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {isSaved ? (
                                    <FaHeart
                                        style={{
                                            fontSize: "16px",
                                            color: "#007bff",
                                        }}
                                    />
                                ) : (
                                    <FaRegHeart
                                        style={{
                                            fontSize: "16px",
                                            color: "#007bff",
                                        }}
                                    />
                                )}
                                {isSaved ? "Saved" : "Save"}
                            </Button>
                        </div>
                        <div>
                            {/* Tabs Header */}
                            <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
                                {tabs.map((tab) => (
                                    <div
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                                            color: activeTab === tab.id ? '#007bff' : '#333',
                                            borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {tab.label}
                                    </div>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div style={{ marginTop: '10px' }}>
                                {activeTab === 0 && <div style={{ padding: '20px', lineHeight: '1.6' }}>
                                    <div className="mt-1">
                                        {singleJob?.description ? (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: singleJob?.description }}
                                            ></div>
                                        ) : (
                                            <p className="text-gray-600">No introduction information yet</p>
                                        )}
                                    </div>

                                </div>}
                                {activeTab === 1 && <div style={{ padding: '20px', lineHeight: '1.6' }}>
                                    <p>   <div className="mt-1">
                                        {singleJob?.requirements ? (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: singleJob?.requirements }}
                                            ></div>
                                        ) : (
                                            <p className="text-gray-600">No information requested yet</p>
                                        )}
                                    </div></p>
                                </div>}
                                {activeTab === 2 && <div style={{ padding: '20px', lineHeight: '1.6' }}>
                                    <div className="flex flex-wrap md:flex-nowrap justify-between rounded-lg">
                                        {/* Cột trái */}
                                        <div className="flex-1 mb-4 md:mb-0 md:mr-6">

                                            <InfoRow
                                                icon={<FiBriefcase className="text-black mr-2" />}
                                                label="Loại công việc:"
                                                value={singleJob?.jobType}
                                            />
                                            <InfoRow
                                                icon={<FiUser className="text-black mr-2" />}
                                                label="Cấp bậc:"
                                                value={singleJob?.jobLevel}
                                            />
                                            <InfoRow
                                                icon={<FiBook className="text-black mr-2" />}
                                                label="Học vấn:"
                                                value={singleJob?.education}
                                            />
                                        </div>

                                        {/* Cột phải */}
                                        <div className="flex-1 md:ml-6">
                                            <InfoRow
                                                icon={<FiClock className="text-black mr-2" />}
                                                label="Kinh nghiệm:"
                                                value={mapExperienceLevel(singleJob?.experienceLevel)}

                                            />
                                            <InfoRow
                                                icon={<FiUsers className="text-black mr-2" />}
                                                label="Giới tính:"
                                                value={singleJob?.gender}
                                            />
                                            <InfoRow
                                                icon={<FiCalendar className="text-black mr-2" />}
                                                label="Tuổi:"
                                                value={singleJob?.age >= 18 ? "18+" : "Dưới 18+"}
                                            />
                                        </div>

                                    </div> <InfoRow
                                        icon={<FiLayers className="text-black mr-2" />}
                                        label="Ngành nghề:"
                                        value={singleJob?.industry}
                                    />


                                </div>}
                                {activeTab === 3 && <div style={{ padding: '20px' }}>
                                    {/* Tiêu đề */}
                                    <h2
                                        style={{
                                            color: '#1a73e8',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '20px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Thông tin liên hệ
                                    </h2>
                                    <VerticalTimeline>
                                        {timelineData.map((item, index) => (
                                            <VerticalTimelineElement
                                                key={index}
                                                className="vertical-timeline-element--work"
                                                contentStyle={{ background: '#f9f9f9', color: '#000', ...item.contentStyle }}
                                                contentArrowStyle={{ borderRight: '7px solid #f9f9f9' }}
                                                iconStyle={item.iconStyle}
                                                icon={item.icon}
                                            >
                                                <h3 className="vertical-timeline-element-title">{item.title}</h3>
                                                <p>{item.content}</p>
                                            </VerticalTimelineElement>
                                        ))}
                                    </VerticalTimeline>
                                </div>}
                                {activeTab === 4 && <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                                    {/* Tiêu đề */}
                                    {/* Header Section */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            marginBottom: '20px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {/* Logo and Company Info */}
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={singleCompany?.logo}
                                                alt="Company Logo"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    marginRight: '20px',
                                                    backgroundColor: '#f0f0f0',
                                                    border: '2px solid #e0e0e0',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                            <div>
                                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>{singleCompany?.companyName}</h2>
                                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                                                    <strong>Địa điểm:</strong> {singleCompany?.location}
                                                </p>
                                                <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                                                    <p style={{ margin: '5px 0' }}>👤 <strong>Người liên hệ:</strong> {singleCompany?.contactPerson}</p>
                                                    <p style={{ margin: '5px 0' }}>👥 <strong>Quy mô company:</strong> {getEmployeeCountRange(singleCompany?.employeeCount)}</p>
                                                    <p style={{ margin: '5px 0' }}>🏢 <strong>Loại hình hoạt động:</strong> {singleCompany?.businessType}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Follow Button */}
                                        {/* <button
                                            style={{
                                                backgroundColor: '#1a73e8',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '10px 20px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            FOLLOW
                                        </button> */}
                                    </div>

                                    {/* Company Description Section */}
                                    <div
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            padding: '20px',
                                        }}
                                    >
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
                                            Giới thiệu về company
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#555', textAlign: 'justify' }}>
                                            {singleCompany?.description ? (
                                                <div
                                                    className="text-gray-600"
                                                    dangerouslySetInnerHTML={{ __html: singleCompany?.description }}
                                                ></div>
                                            ) : (
                                                <p className="text-gray-600">Chưa có thông tin giới thiệu</p>
                                            )}
                                        </p>

                                    </div>
                                </div>}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Company Tương Tự</h2>
                    <div className="space-y-4">
                        {mockSimilarCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                            >
                                <img
                                    src={company.image}
                                    alt={company.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{company.name}</h3>
                                    <p className="text-gray-600">{company.location}</p>
                                    <p className="text-gray-800 font-semibold">
                                        {formatCurrency(company.salary)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
            <Footer />
        </div >
    );
};

export default JobDescription;