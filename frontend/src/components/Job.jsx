import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { FaMoneyBillWave } from 'react-icons/fa'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    }


    return (
        <div className="p-6 rounded-lg shadow-lg bg-white border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    {daysAgoFunction(job?.createdAt) === 0 ? "Hôm nay" : `${daysAgoFunction(job?.createdAt)} ngày trước`}
                </p>
                <Button variant="outline" className="rounded-full p-2" size="icon">
                    <Bookmark />
                </Button>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-3 my-4">
            <Button className="p-4 rounded-full bg-gray-100" variant="outline" size="icon">
    <Avatar>
        <AvatarImage src={job?.company?.logo || "https://yancypher.gold/img/verified.png"} />
    </Avatar>
</Button>

                <div>
                    <h5 className="font-semibold text-base">{`${job?.company?.companyName.slice(0, 22)}...`}</h5>
                    <p className="text-xs text-gray-500">{job?.location}</p>
                </div>
            </div>

            {/* Job Title and Description */}
            <div className="my-4">
                <h5 className="font-bold text-xl text-gray-800">{`${job?.title.slice(0, 22)}...`}</h5>
                <p className="text-sm text-gray-600 mt-2">
                    {job?.description ? (
                        <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: job.description.length > 100
                                    ? `${job.description.slice(0, 100)}...`
                                    : job.description,
                            }}
                        ></div>
                    ) : (
                        <span className="text-gray-600">Chưa có thông tin giới thiệu</span>
                    )}
                </p>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap items-center">

                <FaMoneyBillWave style={{ marginRight: "10px", fontSize: "16px", color: "#555" }} />
                <span>  {formatCurrency(job?.salary)}</span>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6">
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    Chi tiết
                </Button>
                <Button className="bg-purple-700 text-white hover:bg-purple-800">
                    Lưu lại
                </Button>
            </div>
        </div>

    )
}

export default Job
