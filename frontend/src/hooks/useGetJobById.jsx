import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';// Đảm bảo bạn đã tạo slice cho job

const useGetJobById = (id) => {
    const dispatch = useDispatch();
    const { singleJob } = useSelector(store => store.job); // Lấy dữ liệu từ Redux store

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job)); // Lưu dữ liệu vào Redux store
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id, dispatch]);

    return singleJob; // Trả về dữ liệu công việc
};

export default useGetJobById;