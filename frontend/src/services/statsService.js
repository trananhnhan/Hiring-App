// src/services/statsService.js
import api from './api'; // 🚨 Nhớ sửa lại đường dẫn import file axios của bồ (nếu cần)
import { endpoints } from '../constants/endpoints';

export const statsService = {
    getOverviewStats: async () => {
        try {
            const response = await api.get(endpoints.stats.statsMe);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy thông số thống kê:", error);
            throw error;
        }
    }
};