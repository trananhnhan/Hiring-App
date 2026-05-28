import api from './api';
import { endpoints } from '../constants/endpoints';

export const addressService = {
    // 2 API lấy địa giới hành chính (Giữ nguyên)
    getDistricts: async (provinceId) => {
        const response = await api.get(endpoints.locations.districts(provinceId));
        return response.data;
    },
    getWards: async (districtId) => {
        const response = await api.get(endpoints.locations.wards(districtId));
        return response.data;
    },

    // ----------------------------------------------------
    // 👇 3 API ĐỊA CHỈ: Sửa lại đường dẫn gọi endpoints
    // ----------------------------------------------------
    createAddress: async (payload) => {
        // Trỏ vào endpoints.employerProfile.addressCreate
        const response = await api.post(endpoints.employerProfile.addressCreate, payload);
        return response.data;
    },
    
    updateAddress: async (uuid, payload) => {
        // Trỏ vào endpoints.employerProfile.addressUpdate(uuid)
        const response = await api.patch(endpoints.employerProfile.addressUpdate(uuid), payload);
        return response.data;
    },
    
    deleteAddress: async (uuid) => {
        // Trỏ vào endpoints.employerProfile.addressDelete(uuid)
        const response = await api.delete(endpoints.employerProfile.addressDelete(uuid));
        return response.data;
    }
};