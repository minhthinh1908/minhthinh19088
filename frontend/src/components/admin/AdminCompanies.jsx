import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useNavigate } from "react-router-dom"; // Thêm hook useNavigate
import Navbar from "../shared/Navbar";
import { getCompanies, deleteCompany, toggleCompanyStatus } from "@/services/companyService"; // Thay đổi service
import Alert from "../ui/swal";

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all"); // State để lọc loại công ty
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng

    // Kiểm tra token khi component được render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Alert.error("Bạn cần đăng nhập để truy cập trang này.");
            navigate("/"); // Chuyển hướng về trang chủ nếu không có token
        }
    }, [navigate]);

    // Lấy danh sách công ty từ API
    const fetchCompanies = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await getCompanies(token);
            setCompanies(response.data);
        } catch (error) {
            Alert.error("Lỗi khi tải danh sách công ty.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchCompanies khi component được render
    useEffect(() => {
        fetchCompanies();
    }, []);

    const data = React.useMemo(() => {
        if (typeFilter === "all") {
            return companies;
        } else {
            return companies.filter((company) => company.businessType === typeFilter);
        }
    }, [companies, typeFilter]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Tên công ty",
                accessor: "companyName",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Loại hình",
                accessor: "businessType",
                Cell: ({ value }) => {
                    return (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                            {value}
                        </span>
                    );
                },
            },
            {
                Header: "Trạng thái",
                accessor: "isActive",
                Cell: ({ value }) => {
                    // Xác định nhãn và kiểu dáng dựa trên giá trị của isActive
                    let label = "";
                    let className = "";

                    switch (value) {
                        case "pending":
                            label = "Chờ duyệt";
                            className = "bg-yellow-100 text-yellow-600";
                            break;
                        case "active":
                            label = "Đang hoạt động";
                            className = "bg-green-100 text-green-600";
                            break;
                        case "deleted":
                            label = "Đã xóa";
                            className = "bg-gray-100 text-gray-600";
                            break;
                        case "blocked":
                            label = "Đã khóa";
                            className = "bg-red-100 text-red-600";
                            break;
                        default:
                            label = "Không xác định";
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
                        {/* Nút Khóa/Mở khóa */}
                        {row.original.isActive === "active" ? (
                            <button
                                onClick={() => handleToggleCompanyStatus(row.original._id, "blocked")} // Chuyển sang "blocked"
                                className="px-4 py-2 rounded text-white text-sm font-medium bg-red-500 hover:bg-red-600"
                            >
                                Ẩn
                            </button>
                        ) : (
                            <button
                                onClick={() => handleToggleCompanyStatus(row.original._id, "active")} // Chuyển sang "active"
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
        page, // Sử dụng `page` thay vì `rows` để hiển thị dữ liệu phân trang
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
            initialState: { pageIndex: 0, pageSize: 10 }, // Mặc định hiển thị 10 giá trị mỗi trang
        },
        useGlobalFilter,
        usePagination
    );

    const handleDeleteCompany = async (companyId) => {
        try {
            const token = localStorage.getItem("token");
            await deleteCompany(companyId, token); // Gọi hàm từ companyService
            setCompanies(companies.map((company) =>
                company._id === companyId ? { ...company, isActive: "deleted" } : company
            ));
            Alert.success("Xóa công ty thành công.");
        } catch (error) {
            Alert.error(error.message || "Lỗi khi xóa công ty.");
        }
    };

    const handleToggleCompanyStatus = async (companyId,status) => {
        try {
            const token = localStorage.getItem("token");
            await toggleCompanyStatus(companyId,status , token); // Gọi hàm từ companyService
            await fetchCompanies(); // Gọi lại API để cập nhật danh sách công ty
            Alert.success("Cập nhật trạng thái công ty thành công.");
        } catch (error) {
            Alert.error(error.message || "Lỗi khi thay đổi trạng thái công ty.");
        }
    };

    const handleApproveCompany = async (companyId) => {
        try {
            const token = localStorage.getItem("token");
            await approveCompany(companyId, token); // Gọi hàm từ companyService để duyệt công ty
            await fetchCompanies(); // Gọi lại API để cập nhật danh sách công ty
            Alert.success("Duyệt công ty thành công.");
        } catch (error) {
            Alert.error(error.message || "Lỗi khi duyệt công ty.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý công ty</h2>
                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Tìm kiếm công ty..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Type Filter */}
                <div className="mb-4">
                    <label htmlFor="typeFilter" className="mr-2">Lọc theo loại hình:</label>
                    <select
                        id="typeFilter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="IT">Công nghệ thông tin</option>
                        <option value="Finance">Tài chính</option>
                        <option value="Education">Giáo dục</option>
                        {/* Thêm các loại hình khác nếu cần */}
                    </select>
                </div>
                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b"
                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                                        {row.cells.map((cell) => (
                                            <td
                                                {...cell.getCellProps()}
                                                className="py-3 px-4 border-b text-gray-700"
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
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
        </>
    );
};

export default AdminCompanies;