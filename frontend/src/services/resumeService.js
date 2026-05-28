import api from './api';
import { endpoints } from '../constants/endpoints';

export const resumeServices = {
    // 1. Lấy chi tiết
    getResumeDetail: async (uuid) => {
        const response = await api.get(endpoints.resumes.retrieve(uuid));
        return response.data;
    },

    // 2. Hàm gom data chuẩn 1 nhịp
    buildFormData: (payload) => {
        const formData = new FormData();
        
        Object.keys(payload).forEach(key => {
            // ✅ Mảng ID: Append nhiều lần cùng 1 tên key để Django tự gom thành List
            if (key === 'career_fields_id' && Array.isArray(payload[key])) {
                payload[key].forEach(id => {
                    formData.append('career_fields_id', id);
                });
            } 
            // ✅ Xử lý ảnh: Chỉ đính kèm nếu là file ảnh thật sự mới chọn từ điện thoại
            else if (key === 'resume_img') {
                if (payload[key] && typeof payload[key] === 'object' && payload[key].uri) {
                    formData.append('resume_img', {
                        uri: payload[key].uri,
                        name: payload[key].fileName || `resume_${Date.now()}.jpg`,
                        type: payload[key].mimeType || 'image/jpeg'
                    });
                }
            } 
            // ✅ Chữ & Số thông thường
            else if (payload[key] !== null && payload[key] !== undefined) {
                formData.append(key, String(payload[key]));
            }
        });

        return formData;
    },

    // 3. Tạo mới (1 Nhịp duy nhất)
    createResume: async (payload) => {
        const formData = resumeServices.buildFormData(payload);
        const response = await api.post(endpoints.resumes.create, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // 4. Cập nhật (1 Nhịp duy nhất)
    updateResume: async (uuid, payload) => {
        const formData = resumeServices.buildFormData(payload);
        const response = await api.patch(endpoints.resumes.update(uuid), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteResume: async (uuid) => {
        const response = await api.delete(endpoints.resumes.delete(uuid));
        return response.data;
    },
};