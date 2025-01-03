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
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const JobDescription = () => {
    const [activeTab, setActiveTab] = useState(0); // Quản lý trạng thái tab được chọn

    const tabs = [
        { id: 0, label: "Describe" },
        { id: 1, label: "Required skills" },
        { id: 2, label: "Job details" },
        { id: 3, label: "Contact" },
        { id: 4, label: "About the company" },
    ];

    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);
    const [isSaved, setIsSaved] = useState(false);

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
            name: "ABC Company",
            image: "https://via.placeholder.com/64",
            location: "Hà Nội",
            salary: 20000000,
        },
        {
            id: 2,
            name: "XYZ Company",
            image: "https://via.placeholder.com/64",
            location: "TP. Hồ Chí Minh",
            salary: 25000000,
        },
        {
            id: 3,
            name: "DEF Company",
            image: "https://via.placeholder.com/64",
            location: "Đà Nẵng",
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

        <div>
            <Navbar />

            <div className="max-w-7xl mx-auto my-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Column */}
                <div className="col-span-2">
                
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
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                backgroundImage: `url('https://via.placeholder.com/80')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "5px",
                                marginRight: "15px",
                                border: "1px solid #ddd",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        ></div>
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
                            <span>Date of posting: 20-12-2024 | Expires in: 23 days</span>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "20px" }}>
                        {/* Nút Nộp Đơn */}
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-lg px-6 py-3 text-lg font-medium transition duration-300 ${isApplied
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
            <div style={{ padding: '20px', marginTop: '10px' }}>
                {activeTab === 0 &&  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            {/* Tiêu đề */}
            <h2 style={{ color: '#1a73e8', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Mô tả công việc
            </h2>

            {/* Nội dung */}
            <ul style={{ paddingLeft: '20px' }}>
                <li>
                    Hỗ trợ sếp Nhật trong việc quản lý bộ phận Nhân sự - Tổng vụ - Kế toán.
                </li>
                <li>
                    Quản lý cấp dưới: 1 Trưởng nhóm, 1-2 nhân viên.
                </li>
                <li>
                    Nghiệp vụ Nhân sự: tuyển dụng nhân viên và công nhân, làm các thủ tục nhận việc/nghỉ việc cho NLD (làm hợp đồng LĐ, thanh lý hợp đồng LĐ, tăng giảm bảo hiểm, đăng ký mã số thuế...), chấm công, xây dựng thang bảng lương/nội quy công ty, tính lương/PIT...
                </li>
                <li>
                    Nghiệp vụ Hành chính: làm visa/giấy phép LĐ cho người nước ngoài, quản lý hợp đồng của các nhà cung cấp dịch vụ (bảo vệ, lao công, tài quản lý tài sản công ty, tổ chức sự kiện công ty, đối ứng với bên quản lý KCN/cơ quan ban ngành...).
                </li>
                <li>
                    Nghiệp vụ Kế toán: quản lý tiền mặt, giao dịch với ngân hàng, quản lý các chứng từ kế toán (có dùng dịch vụ ngoài)...
                </li>
                <li>
                    Báo cáo công việc cho sếp Nhật.
                </li>
                <li>
                    Thời gian làm việc: T2-T7: 8:00-17:00 (Lịch làm việc T7 chưa được quyết định).
                </li>
                <li>
                    Địa điểm làm việc: KCN Long Đức, Long Thành (có xe đưa đón từ Biên Hòa).
                </li>
            </ul>

            {/* Ghi chú */}
            <div style={{ marginTop: '20px', color: '#d32f2f', fontWeight: 'bold' }}>
                *** Lịch phỏng vấn: tiến hành phỏng vấn, tuyển dụng trong tháng 1/2025.
                <br />
                *** Lịch làm việc chính thức: dự kiến từ 7/2025.
            </div>
        </div>}
                {activeTab === 1 &&  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            {/* Tiêu đề */}
            <h2 style={{ color: '#1a73e8', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Kinh nghiệm / Kỹ năng chi tiết
            </h2>

            {/* Danh sách yêu cầu */}
            <ul style={{ paddingLeft: '20px' }}>
                <li>Nam/Nữ (30-38t). Tốt nghiệp CĐ trở lên.</li>
                <li>Tiếng Nhật giao tiếp tốt (trình độ N2 trở lên).</li>
                <li>
                    Kinh nghiệm quản lý bộ phận HR-GA, ưu tiên biết thêm về Kế toán 
                    (chức vụ Leader / Supervisor / Manager).
                </li>
                <li>Kinh nghiệm quản lý cấp dưới.</li>
                <li>
                    Ưu tiên có kinh nghiệm set up hệ thống HR-GA trong các công ty mới thành lập.
                </li>
                <li>Hiểu rõ Luật lao động VN.</li>
                <li>Ưu tiên có thể tự túc đi lại đến KCN Long Đức.</li>
            </ul>

        </div>}
                {activeTab === 2 && <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            {/* Tiêu đề */}
            <h2 style={{ color: '#1a73e8', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Mô tả
            </h2>

            {/* Container */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Cột trái */}
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <p><strong># Job Code:</strong> D19610</p>
                    <p><strong>Job Type:</strong> Full-time employee</p>
                    <p><strong>Rank:</strong> Manager / Department Head</p>
                    <p><strong>Education:</strong> College</p>
                </div>

                {/* Cột phải */}
                <div style={{ flex: 1, marginLeft: '10px' }}>
                    <p><strong>Experience:</strong> 5 - 10 years experience</p>
                    <p><strong>Sex:</strong> Male / Female</p>
                    <p><strong>Year old:</strong> 30 - 38</p>
                    <p><strong>Industry:</strong> Secretary / Administration, Human Resources, Interpretation (Japanese)</p>
                </div>
            </div>
        </div>}
                {activeTab === 3 &&      <div style={{
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            {/* Tiêu đề */}
            <h2 style={{
                color: '#1a73e8',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                Contact information
            </h2>

            {/* Timeline Container */}
            <div style={{
                position: 'relative',
                paddingLeft: '40px',
                marginTop: '20px'
            }}>
                {/* Đường timeline */}
                <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: '#e0e0e0'
                }}></div>

                {/* Tên liên hệ */}
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '0',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#e53935',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: '1'
                    }}>📍</div>
                    <p>
                        <strong>Contact name:</strong> Ms. Ngọc Hân
                    </p>
                </div>

                {/* Điện thoại */}
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '0',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#1e88e5',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: '1'
                    }}>📞</div>
                    <p>
                        <strong>Điện thoại:</strong> 028 - 3812 2706 (Zalo Ngọc Hân - 0342808840)
                    </p>
                </div>

                {/* Email */}
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '0',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#f57c00',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: '1'
                    }}>✉️</div>
                    <p>
                        <strong>Email:</strong> ngochan@careerlink.vn
                    </p>
                </div>

                {/* Địa chỉ */}
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '0',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#43a047',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: '1'
                    }}>🏢</div>
                    <p>
                        <strong>Address:</strong> Room 302, NK Building, 270-272 Cong Hoa, Ward 13, Tan Binh District, Ho Chi Minh City, Vietnam
                    </p>
                </div>

                {/* Ghi chú */}
                <div style={{ marginTop: '20px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '0',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#ffc107',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: '1'
                    }}>📝</div>
                    <p style={{ fontStyle: 'italic', color: '#757575' }}>
                        - Interested candidates can apply online, by email or in person at the company.
                    </p>
                </div>
            </div>
        </div>}
                {activeTab === 4 && <div>About the content company here</div>}
            </div>
        </div>
                    <div className="bg-white rounded-lg shadow-lg mt-10 p-6">
                        <h1 className="text-2xl font-semibold border-b pb-4">Job Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <h2 className="font-bold text-lg">Location:</h2>
                                <p className="text-gray-700">{singleJob?.title}</p>
                                <h2 className="font-bold text-lg mt-4">Location:</h2>
                                <p className="text-gray-700"></p>
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

                {/* Right Column */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Công Ty Tương Tự</h2>
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
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;