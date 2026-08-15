import api from './api';
import { endpoints } from '../constants/endpoints';

export const verificationService = {
    
    getMyRequests: async () => {
        const response = await api.get(endpoints.verificationRequests.list);
        return response.data;
    },

    
    getRequestDetail: async (uuid) => {
        const response = await api.get(endpoints.verificationRequests.detail(uuid));
        return response.data;
    },

    
    createRequest: async (imagesArray) => {
        const formData = new FormData();
        
        imagesArray.forEach((img, index) => {
            formData.append('upload_images', {
                uri: img.uri,
                name: img.fileName || `verify_${Date.now()}_${index}.jpg`,
                type: img.mimeType || 'image/jpeg'
            });
        });

        const response = await api.post(endpoints.verificationRequests.create, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteRequest: async (uuid) => {
        const response = await api.delete(endpoints.verificationRequests.detail(uuid));
        return response.data;
    },
    getAllRequests: async () => {

        const response = await api.get(endpoints.verificationRequests.list);
        return response.data;
    },


    verifyRequest: async (uuid, statusStr) => {
        const response = await api.patch(endpoints.verificationRequests.verify(uuid), {
            status: statusStr
        });
        return response.data;
    }
};