import React, { useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useNavigate } from "react-router-dom"; // Thêm hook useNavigate
import Navbar from "../shared/Navbar";
import { getUsers, deleteUser, toggleUserStatus, approveUser } from "@/services/authService"; // Thêm hàm approveUser
import Alert from "../ui/swal";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState("all"); // State để lưu vai trò được chọn
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng

    // Kiểm tra token khi component được render
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Alert.error("Bạn cần đăng nhập để truy cập trang này.");
            navigate("/"); // Chuyển hướng về trang chủ nếu không có token
        }
    }, [navigate]);

    // Lấy danh sách người dùng từ API
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await getUsers(token);
            setUsers(response.data);
        } catch (error) {
            Alert.error("Lỗi khi tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchUsers khi component được render
    useEffect(() => {
        fetchUsers();
    }, []);

    const data = React.useMemo(() => {
        if (roleFilter === "all") {
            return users;
        } else {
            return users.filter((user) => user.role === roleFilter);
        }
    }, [users, roleFilter]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Họ và tên",
                accessor: "fullname",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Vai trò",
                accessor: "role",
                Cell: ({ value }) => {
                    const renderRoleBadge = (role) => {
                        switch (role) {
                            case "student":
                                return (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                                        Học viên
                                    </span>
                                );
                            case "recruiter":
                                return (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                                        Nhà tuyển dụng
                                    </span>
                                );
                            case "admin":
                                return (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600">
                                        Quản trị viên
                                    </span>
                                );
                            default:
                                return role;
                        }
                    };
                    return renderRoleBadge(value);
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
                        <button
                            onClick={() => handleToggleUserStatus(row.original._id)}
                            className={`px-4 py-2 rounded text-white text-sm font-medium ${row.original.isActive === "active"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {row.original.isActive === "active" ? "Khóa" : "Mở khóa"}
                        </button>

                        {/* Nút Duyệt (chỉ hiển thị nếu trạng thái là pending hoặc vai trò là recruiter) */}
                        {(row.original.isActive === "pending" && row.original.role === "recruiter") && (
                            <button
                                onClick={() => handleApproveUser(row.original._id)}
                                className="px-4 py-2 rounded text-white text-sm font-medium bg-green-500 hover:bg-green-600"
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

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await deleteUser(userId, token); // Gọi hàm từ authService
            setUsers(users.map((user) =>
                user._id === userId ? { ...user, isActive: "deleted" } : user
            ));
            Alert.success("Xóa người dùng thành công.");
        } catch (error) {
            Alert.error(error.message || "Lỗi khi xóa người dùng.");
        }
    };

    const handleToggleUserStatus = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await toggleUserStatus(userId, token); // Gọi hàm từ authService
            await fetchUsers(); // Gọi lại API để cập nhật danh sách người dùng
            Alert.success("Cập nhật trạng thái người dùng thành công.");
        } catch (error) {
            Alert.error(error.message || "Lỗi khi thay đổi trạng thái người dùng.");
        }
    };

    const handleApproveUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await approveUser(userId, token); // Gọi hàm từ authService để duyệt người dùng
            await fetchUsers(); // Gọi lại API để cập nhật danh sách người dùng
            Alert.success("Duyệt người dùng thành công.");
        } catch (error) {
            Alert.error(error.message || "Lỗi khi duyệt người dùng.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý người dùng</h2>
                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Tìm kiếm người dùng..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Role Filter */}
                <div className="mb-4">
                    <label htmlFor="roleFilter" className="mr-2">Lọc theo vai trò:</label>
                    <select
                        id="roleFilter"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="student">Học viên</option>
                        <option value="recruiter">Nhà tuyển dụng</option>
                        <option value="admin">Quản trị viên</option>
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

export default AdminUsers;