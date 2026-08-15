import api from './api';
import { endpoints } from '../constants/endpoints';

export const resumeServices = {
    
    getResumeDetail: async (uuid) => {
        const response = await api.get(endpoints.resumes.retrieve(uuid));
        return response.data;
    },

    
    buildFormData: (payload) => {
        const formData = new FormData();
        
        Object.keys(payload).forEach(key => {
            
            if (key === 'career_fields_id' && Array.isArray(payload[key])) {
                payload[key].forEach(id => {
                    formData.append('career_fields_id', id);
                });
            } 
            
            else if (key === 'resume_img') {
                if (payload[key] && typeof payload[key] === 'object' && payload[key].uri) {
                    formData.append('resume_img', {
                        uri: payload[key].uri,
                        name: payload[key].fileName || `resume_${Date.now()}.jpg`,
                        type: payload[key].mimeType || 'image/jpeg'
                    });
                }
            } 
            
            else if (payload[key] !== null && payload[key] !== undefined) {
                formData.append(key, String(payload[key]));
            }
        });

        return formData;
    },

    
    createResume: async (payload) => {
        const formData = resumeServices.buildFormData(payload);
        const response = await api.post(endpoints.resumes.create, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    
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