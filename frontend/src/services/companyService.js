import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";


// Lấy danh sách công ty
export const getCompanies = async (token) => {
    try {
        const response = await axios.get(ADMIN_API_END_POINT + "/companies", {
            headers: {
                "x-auth-token": token, // Sử dụng "x-auth-token" thay vì "Authorization"
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách công ty.");
    }
};

// Lấy thông tin chi tiết công ty
export const getCompanyDetails = async (companyId, token) => {
    try {
        const response = await axios.get(`${ADMIN_API_END_POINT + "/companies"}/${companyId}`, {
            headers: {
                "x-auth-token": token,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi tải thông tin công ty.");
    }
};

// Tạo công ty mới
export const createCompany = async (companyData, token) => {
    try {
        const response = await axios.post(ADMIN_API_END_POINT + "/companies", companyData, {
            headers: {
                "x-auth-token": token,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi tạo công ty.");
    }
};

// Cập nhật thông tin công ty
export const updateCompany = async (companyId, companyData, token) => {
    try {
        const response = await axios.put(`${ADMIN_API_END_POINT + "/companies"}/${companyId}`, companyData, {
            headers: {
                "x-auth-token": token,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi cập nhật công ty.");
    }
};

// Xóa công ty
export const deleteCompany = async (companyId, token) => {
    try {
        const response = await axios.delete(`${ADMIN_API_END_POINT + "/companies"}/${companyId}`, {
            headers: {
                "x-auth-token": token,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi xóa công ty.");
    }
};

// Thay đổi trạng thái công ty
export const toggleCompanyStatus = async (companyId,status, token) => {
    try {
        const response = await axios.put(
            `${ADMIN_API_END_POINT + "/companies"}/${companyId}/status`,
            { status }, // Gửi trạng thái mới lên server
            {
                headers: {
                    "x-auth-token": token,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi khi thay đổi trạng thái công ty.");
    }
};