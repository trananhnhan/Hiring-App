
import api from './api'; 
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