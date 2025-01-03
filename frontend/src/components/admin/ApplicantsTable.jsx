import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import Modal from '../ui/modal'; // Component Modal

// STATUS_MAPPING: Status mapping
const STATUS_MAPPING = {
    0: "Pending",
    1: "Accepted",
    2: "Rejected",
    3: "Interview Invitation",
    4: "Interview Result",
    5: "Job Offer"
};

// List of statuses to display in the dropdown
const shortlistingStatus = Object.entries(STATUS_MAPPING);

const InterviewInvitationForm = ({ onSubmit }) => (
    <form
        onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            onSubmit(data);
        }}
    >
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Interview Date</label>
            <input
                type="date"
                name="interviewDate"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
                type="time"
                name="interviewTime"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
                type="text"
                name="interviewLocation"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter location"
                required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
            Send Information
        </button>
    </form>
);

const InterviewResultForm = ({ onSubmit }) => (
    <form
        onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            onSubmit(data);
        }}
    >
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <textarea
                name="interviewResult"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter interview result"
                required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
            Submit Result
        </button>
    </form>
);

const JobOfferForm = ({ onSubmit }) => (
    <form
        onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            onSubmit(data);
        }}
    >
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
                type="text"
                name="offerSalary"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter proposed salary"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
                type="date"
                name="startDate"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
            Send Offer
        </button>
    </form>
);

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // Modal type (3, 4, 5)
    const [currentApplicantId, setCurrentApplicantId] = useState(null); // Current applicant ID

    const statusHandler = async (status, id) => {
        if ([3, 4, 5].includes(status)) {
            setModalType(status);
            setCurrentApplicantId(id);
            setIsModalOpen(true);
        } else {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
                if (res.data.success) {
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        }
    };

    const handleModalSubmit = async (data) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${currentApplicantId}/update`, {
                status: modalType,
                details: data,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>List of recently applied candidates</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>CV</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a
                                        className="text-blue-600 cursor-pointer"
                                        href={item?.applicant?.profile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>N/A</span>
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell>{STATUS_MAPPING[item?.status] || "Unknown"}</TableCell>
                            <TableCell className="float-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        {shortlistingStatus.map(([statusCode, statusLabel]) => (
                                            <div
                                                onClick={() => statusHandler(Number(statusCode), item?._id)}
                                                key={statusCode}
                                                className="flex w-fit items-center my-2 cursor-pointer"
                                            >
                                                <span>{statusLabel}</span>
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Enter Information: ${STATUS_MAPPING[modalType]}`}
                >
                    {modalType === 3 && <InterviewInvitationForm onSubmit={handleModalSubmit} />}
                    {modalType === 4 && <InterviewResultForm onSubmit={handleModalSubmit} />}
                    {modalType === 5 && <JobOfferForm onSubmit={handleModalSubmit} />}
                </Modal>
            )}
        </div>
    );
};

export default ApplicantsTable;