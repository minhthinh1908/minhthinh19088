import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillAlt, FaClock } from 'react-icons/fa'; // Sử dụng icons từ react-icons

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const truncatedDescription = job?.description
        ? job.description.length > 100
            ? job.description.substring(0, 100) + '...'
            : job.description
        : 'Chưa có thông tin giới thiệu';

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-6 rounded-lg shadow-md bg-white border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-300'
        >
            <div className='flex space-x-4'>
                {/* Avatar Column */}
                <div className='flex-shrink-0 relative'>
                    <img
                        src={job?.company?.logo || 'https://via.placeholder.com/50'}
                        alt={job?.company?.name}
                        className='w-16 h-16 rounded-lg object-cover border border-gray-200'
                    />

                </div>

                {/* Details Column */}
                <div className='flex flex-col flex-grow space-y-3'>
                    {/* Company Info */}
                    <div>
                        <h1 className='font-semibold text-xl text-gray-800'>{job?.company?.name}</h1>
                        <p className='text-sm text-gray-500'>Việt Nam</p>
                    </div>

                    {/* Job Title */}
                    <div>
                        <h1 className='font-bold text-2xl text-gray-900 mb-2'>{job?.title}</h1>
                        <div className='text-sm text-gray-700'>
                            {job?.description ? (
                                <div className="text-gray-700">
                                    {showFullDescription ? (
                                        <div dangerouslySetInnerHTML={{ __html: job.description }} />
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: truncatedDescription }} />
                                    )}
                                    {job.description.length > 100 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDescription();
                                            }}
                                            className='text-blue-600 hover:underline focus:outline-none'
                                        >
                                            {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-700">Chưa có thông tin giới thiệu</p>
                            )}
                        </div>
                    </div>

                    {/* Job Details with Icons */}
                    <div className='grid grid-cols-2 gap-3 mt-2'>
                        <div className='flex items-center space-x-2 text-gray-700'>
                            <FaMapMarkerAlt className='text-gray-500' />
                            <span>{job?.location || 'Không xác định'}</span>
                        </div>
                        <div className='flex items-center space-x-2 text-gray-700'>
                            <FaMoneyBillAlt className='text-gray-500' />
                            <span>{formatCurrency(job?.salary)}</span>
                        </div>
                        <div className='flex items-center space-x-2 text-gray-700'>
                            <FaClock className='text-gray-500' />
                            <span className='whitespace-nowrap bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm'>
                                {job?.jobType}
                            </span>
                        </div>
                    </div>

                    {/* View More Button */}
                    <div className='mt-4'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/description/${job._id}`);
                            }}
                            className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300'
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestJobCards;