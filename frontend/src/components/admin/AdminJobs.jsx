import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar' // Thanh điều hướng của trang
import { Input } from '../ui/input' // Trường nhập liệu
import { Button } from '../ui/button' // Nút bấm
import { useNavigate } from 'react-router-dom' // Dùng để điều hướng
import { useDispatch } from 'react-redux' // Dùng để gửi các hành động Redux
import AdminJobsTable from './AdminJobsTable' // Bảng hiển thị danh sách công việc
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs' // Hook để lấy tất cả công việc cho quản trị viên
import { setSearchJobByText } from '@/redux/jobSlice' // Hành động Redux để lọc công việc theo từ khóa

const AdminJobs = () => {
  useGetAllAdminJobs(); // Lấy tất cả công việc khi trang được tải
  const [input, setInput] = useState(""); // Trạng thái lưu từ khóa lọc
  const navigate = useNavigate(); // Dùng để điều hướng trang
  const dispatch = useDispatch(); // Gửi hành động đến Redux

  // Dùng useEffect để gửi từ khóa lọc đến Redux mỗi khi từ khóa thay đổi
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div>
      <Navbar /> {/* Thanh điều hướng */}
      <div className='max-w-6xl mx-auto my-10'>
        {/* Phần tìm kiếm và nút thêm công việc mới */}
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)} // Cập nhật trạng thái từ khóa tìm kiếm
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>New job</Button> {/* Điều hướng đến trang tạo công việc */}
        </div>
        <AdminJobsTable /> {/* Hiển thị bảng công việc quản trị viên */}
      </div>
    </div>
  )
}

export default AdminJobs;
