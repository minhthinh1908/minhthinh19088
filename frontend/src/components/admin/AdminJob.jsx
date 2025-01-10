import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { getJobs, deleteJob, toggleJobStatus, createJob, updateJob } from "@/services/jobService";
import Alert from "../ui/swal";
import ReactModal from "react-modal"; // Import ReactModal
import PostJobForm from "./PostJobForm";

const AdminJob = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "all",
        jobType: "all",
        location: "all",
    });
    const [showModal, setShowModal] = useState(false); // State để quản lý việc hiển thị modal
    const [modalContent, setModalContent] = useState(""); // State để lưu trữ nội dung hiển thị trong modal
    const [showFormModal, setShowFormModal] = useState(false); // State để quản lý việc hiển thị form thêm/chỉnh sửa
    const [selectedJob, setSelectedJob] = useState(null); // State để lưu trữ công việc được chọn để chỉnh sửa
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        salary: "",
        location: "",
        jobType: "",
        requirements: "",
        isActive: "active",
    });
    const navigate = useNavigate();

    // Thiết lập ReactModal cho ứng dụng
    ReactModal.setAppElement("#root"); // Đảm bảo bạn có một phần tử có id="root" trong HTML của bạn

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Alert.error("Bạn cần đăng nhập để truy cập trang này.");
            navigate("/");
        }
    }, [navigate]);

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await getJobs(token);
            console.log("Data from API:", response);
            if (Array.isArray(response)) {
                setJobs(response);
            } else {
                setJobs([]);
            }
        } catch (error) {
            Alert.error("Lỗi khi tải danh sách công việc.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const data = React.useMemo(() => {
        return jobs.filter((job) => {
            const statusMatch = filters.status === "all" || job.status === filters.status;
            const jobTypeMatch = filters.jobType === "all" || job.jobType === filters.jobType;
            const locationMatch = filters.location === "all" || job.location === filters.location;
            return statusMatch && jobTypeMatch && locationMatch;
        });
    }, [jobs, filters]);

    const handleViewDetails = (content) => {
        console.log("Xem chi tiết được click"); // Kiểm tra xem hàm có được gọi không
        setModalContent(content); // Lưu nội dung cần hiển thị
        setShowModal(true); // Hiển thị modal
    };

    const closeModal = () => {
        setShowModal(false); // Đóng modal
        setModalContent(""); // Xóa nội dung
    };

    const handleAddJob = () => {
        setSelectedJob(null); // Đặt selectedJob thành null để hiển thị form thêm mới
        setFormData({
            title: "",
            description: "",
            salary: "",
            location: "",
            jobType: "",
            requirements: "",
            isActive: "active",
        });
        setShowFormModal(true); // Hiển thị form modal
    };

    const handleEditJob = (job) => {
        setSelectedJob(job); // Lưu công việc được chọn
        setFormData({
            title: job.title,
            description: job.description,
            salary: job.salary,
            location: job.location,
            jobType: job.jobType,
            requirements: job.requirements,
            isActive: job.isActive,
        });
        setShowFormModal(true); // Hiển thị form modal
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (selectedJob) {
                // Cập nhật công việc
                await updateJob(selectedJob._id, formData, token);
                Alert.success("Cập nhật công việc thành công.");
            } else {
                // Thêm công việc mới
                await createJob(formData, token);
                Alert.success("Thêm công việc thành công.");
            }
            await fetchJobs(); // Lấy lại danh sách công việc
            setShowFormModal(false); // Đóng form modal
        } catch (error) {
            Alert.error(error.response?.data?.message || "Lỗi khi lưu công việc.");
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const closeFormModal = () => {
        setShowFormModal(false); // Đóng form modal
        setSelectedJob(null); // Xóa công việc được chọn
    };

    // Hàm giới hạn số ký tự hiển thị
    const truncateText = (text, maxLength) => {
        if (!text) return ""; // Kiểm tra nếu text là null hoặc undefined
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "Tiêu đề",
                accessor: "title",
                Cell: ({ value }) => truncateText(value, 100), // Giới hạn 100 ký tự
            },
            {
                Header: "Mô tả",
                accessor: "description",
                Cell: ({ value }) => (
                    <button
                        onClick={() => handleViewDetails(value)}
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        Xem chi tiết
                    </button>
                ),
            },
            {
                Header: "Lương",
                accessor: "salary",
                Cell: ({ value }) => {
                    // Định dạng lương thành tiền VNĐ
                    return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(value);
                },
            },
            {
                Header: "Địa điểm",
                accessor: "location",
                Cell: ({ value }) => truncateText(value, 100), // Giới hạn 100 ký tự
            },
            {
                Header: "Loại công việc",
                accessor: "jobType",
                Cell: ({ value }) => truncateText(value, 100), // Giới hạn 100 ký tự
            },
            {
                Header: "Yêu cầu",
                accessor: "requirements",
                Cell: ({ value }) => (
                    <button
                        onClick={() => handleViewDetails(value)}
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        Xem chi tiết
                    </button>
                ),
            },
            {
                Header: "Trạng thái",
                accessor: "isActive",
                Cell: ({ value }) => {
                    let label = "";
                    let className = "";

                    switch (value) {
                        case "active":
                            label = "Đang hoạt động";
                            className = "bg-green-100 text-green-600";
                            break;
                        case "inactive":
                            label = "Không hoạt động";
                            className = "bg-red-100 text-red-600";
                            break;
                        case "pending":
                            label = "Chờ duyệt";
                            className = "bg-yellow-100 text-yellow-600";
                            break;
                        default:
                            label = "Đang ẩn";
                            className = "bg-gray-100 text-gray-600";
                            break;
                    }

                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}
                        >
                            {label}
                        </span>
                    );
                },
            },
            {
                Header: "Hành động",
                accessor: "_id",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        {/* <button
                            onClick={() => handleEditJob(row.original)}
                            className="px-4 py-2 rounded text-white text-sm font-medium bg-yellow-500 hover:bg-yellow-600"
                        >
                            Chỉnh sửa
                        </button> */}
                        {row.original.isActive === "active" ? (
                            <button
                                onClick={() => handleToggleJobStatus(row.original._id, "blocked")} // Chuyển sang "blocked"
                                className="px-4 py-2 rounded text-white text-sm font-medium bg-red-500 hover:bg-red-600"
                            >
                                Ẩn
                            </button>
                        ) : (
                            <button
                                onClick={() => handleToggleJobStatus(row.original._id, "active")} // Chuyển sang "active"
                                className="px-4 py-2 rounded text-white text-sm font-medium bg-blue-500 hover:bg-blue-600"
                            >
                                Duyệt
                            </button>
                        )}

                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        usePagination
    );

    const handleDeleteJob = async (jobId) => {
        try {
            const token = localStorage.getItem("token");
            await deleteJob(jobId, token);
            setJobs(jobs.filter((job) => job._id !== jobId));
            Alert.success("Xóa công việc thành công.");
        } catch (error) {
            Alert.error(error.response?.data?.message || "Lỗi khi xóa công việc.");
        }
    };

    const handleToggleJobStatus = async (jobId, status) => {
        try {
            const token = localStorage.getItem("token");
            await toggleJobStatus(jobId, status, token);
            await fetchJobs();
            Alert.success("Cập nhật trạng thái công việc thành công.");
        } catch (error) {
            Alert.error(error.response?.data?.message || "Lỗi khi thay đổi trạng thái công việc.");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Quản lý công việc</h2>
                    {/* <button
                        onClick={() => setShowFormModal(true)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Thêm công việc
                    </button> */}
                </div>
                <ReactModal
                    isOpen={showFormModal}
                    onRequestClose={() => setShowFormModal(false)}
                    contentLabel={selectedJob ? "Chỉnh sửa công việc" : "Thêm công việc"}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                        },
                        content: {
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            maxWidth: "500px",
                            width: "90%",
                            margin: "0 auto",
                            position: "relative",
                            top: "auto",
                            left: "auto",
                            right: "auto",
                            bottom: "auto",
                            transform: "none",
                            border: "none",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                >
                    <PostJobForm
                        job={selectedJob}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowFormModal(false)}
                    />
                </ReactModal>
                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Tìm kiếm công việc..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Filters */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái:</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="pending">Chờ duyệt</option>
                        </select>
                    </div>
                    {/* Job Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại công việc:</label>
                        <select
                            name="jobType"
                            value={filters.jobType}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="Full-time">Toàn thời gian</option>
                            <option value="Part-time">Bán thời gian</option>
                            <option value="Remote">Làm việc từ xa</option>
                        </select>
                    </div>
                    {/* Location Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm:</label>
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                        </select>
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            {headerGroups.map((headerGroup) => {
                                const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr key={key} {...restHeaderGroupProps}>
                                        {headerGroup.headers.map((column) => {
                                            const { key: columnKey, ...restColumnProps } = column.getHeaderProps();
                                            return (
                                                <th key={columnKey} {...restColumnProps} className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                                                    {column.render("Header")}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                const { key, ...restRowProps } = row.getRowProps();
                                return (
                                    <tr key={key} {...restRowProps} className="hover:bg-gray-50">
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...restCellProps } = cell.getCellProps();
                                            return (
                                                <td key={cellKey} {...restCellProps} className="py-3 px-4 border-b text-gray-700">
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <div>
                        <span>
                            Trang{" "}
                            <strong>
                                {pageIndex + 1} / {pageOptions.length}
                            </strong>
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                            className="ml-2 px-2 py-1 border border-gray-300 rounded"
                        >
                            {[10, 20, 30, 40, 50].map((size) => (
                                <option key={size} value={size}>
                                    Hiển thị {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className={`px-4 py-2 rounded text-white text-sm font-medium ${canPreviousPage ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            Trang trước
                        </button>
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className={`px-4 py-2 rounded text-white text-sm font-medium ${canNextPage ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal hiển thị chi tiết */}
            <ReactModal
                isOpen={showModal}
                onRequestClose={closeModal}
                contentLabel="Chi tiết công việc"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000, // Đảm bảo modal hiển thị trên các phần tử khác
                    },
                    content: {
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        maxWidth: "500px",
                        width: "90%",
                        margin: "0 auto",
                        position: "relative",
                        top: "auto",
                        left: "auto",
                        right: "auto",
                        bottom: "auto",
                        transform: "none",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                }}
            >
                <div className="p-6">
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: modalContent }}
                    ></div>
                    <button
                        onClick={closeModal}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Đóng
                    </button>
                </div>
            </ReactModal>


        </>
    );
};

export default AdminJob;