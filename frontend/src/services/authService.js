import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";

// Đăng nhập
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${ADMIN_API_END_POINT}/login`, { email, password });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};

// Lấy thông tin người dùng
export const getUser = async (token) => {
    try {
        const response = await axios.get(`${ADMIN_API_END_POINT}/users`, {
            headers: { "x-auth-token": token }
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};
export const getUsers = async (token) => {
    try {
        const response = await axios.get(`${ADMIN_API_END_POINT}/users`, {
            headers: { "x-auth-token": token }
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};
export const deleteUser = async (userId, token) => {
    try {
        const response = await axios.delete(`${ADMIN_API_END_POINT}/users/${userId}`, {
            headers: { "x-auth-token": token },
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};

export const approveUser = async (userId, token) => {
    try {
        const response = await axios.put(
            `${ADMIN_API_END_POINT}/users/${userId}/acp`,
            {}, // Không có payload trong trường hợp này
            {
                headers: { "x-auth-token": token },
            }
        );
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};
export const toggleUserStatus = async (userId, token) => {
    try {
        const response = await axios.put(
            `${ADMIN_API_END_POINT}/users/${userId}/toggle-status`,
            {}, // Không có payload trong trường hợp này
            {
                headers: { "x-auth-token": token },
            }
        );
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};

// Đăng xuất
export const logout = async (token) => {
    try {
        const response = await axios.post(`${ADMIN_API_END_POINT}/logout`, null, {
            headers: { "x-auth-token": token }
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        if (error.response && error.response.data) {
            throw error.response.data; // Trả về thông báo lỗi từ server
        } else {
            throw { success: false, message: "Lỗi kết nối đến server." };
        }
    }
};