import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";


// Lấy danh sách công việc
export const getJobs = async (token) => {
    try {
        const response = await axios.get(ADMIN_API_END_POINT + "/jobs", {
            headers: {
                "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách công việc.");
    }
};

// Xóa một công việc
export const deleteJob = async (jobId, token) => {
    try {
        const response = await axios.delete(`${ADMIN_API_END_POINT}/${jobId}`, {
            headers: {
                "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi xóa công việc.");
    }
};

// Thay đổi trạng thái công việc (active/inactive)
export const toggleJobStatus = async (jobId, status, token) => {
    try {
        const response = await axios.put(
            `${ADMIN_API_END_POINT}/jobs/${jobId}/status`,
            { status }, // Gửi trạng thái mới lên server
            {
                headers: {
                    "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi thay đổi trạng thái công việc.");
    }
};

// Tạo một công việc mới
export const createJob = async (jobData, token) => {
    try {
        const response = await axios.post(ADMIN_API_END_POINT+"/jobs", jobData, {
            headers: {
                "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi tạo công việc.");
    }
};

// Cập nhật thông tin công việc
export const updateJob = async (jobId, jobData, token) => {
    try {
        const response = await axios.put(`${ADMIN_API_END_POINT}/${jobId}`, jobData, {
            headers: {
                "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi cập nhật công việc.");
    }
};

// Lấy thông tin chi tiết của một công việc
export const getJobDetails = async (jobId, token) => {
    try {
        const response = await axios.get(`${ADMIN_API_END_POINT}/${jobId}`, {
            headers: {
                "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi tải thông tin công việc.");
    }
};