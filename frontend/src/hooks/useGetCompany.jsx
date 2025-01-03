import { setSingleCompany } from '@/redux/companySlice'; // Cập nhật action
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetCompanyById = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company)); // Lưu thông tin công ty vào Redux
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (id) {
            fetchCompany(); // Chỉ gọi API nếu `id` tồn tại
        }
    }, [id, dispatch]); // Thêm `id` vào dependency array
};

export default useGetCompanyById;