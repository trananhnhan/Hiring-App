import { BASE_URL } from "../constants/config"
import { endpoints } from "../constants/endpoints"
import api from "./api"


export const jobServices = {

    getGlobalJobPosts: async (page = 1, params = {}) => {
        const response = await api.get(endpoints.jobPosts.list, {
            params: {
                page: page,
                ...params
            }
        });
        return response.data;
    },

    getFollowedJobPosts: async (page = 1, params = {}) => {
        const response = await api.get(endpoints.jobPosts.list, {
            params: {
                is_followed: true,
                page: page,
                ...params
            }
        });
        return response.data;
    },

    getEmployerJobPosts: async (page = 1, params = {}) => {
        const response = await api.get(endpoints.employerProfile.listJobPost, { params: { page, ...params } });
        return response.data;
    },
    getJobPostDetail: async (uuid) => {
        const response = await api.get(endpoints.jobPosts.retrieve(uuid));
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
            else if (key === 'work_days') {
                const stringifiedData = JSON.stringify(payload[key]);
                formData.append(key, stringifiedData);
            }
            else if (key === 'job_thumbnail') {
                if (payload[key] && typeof payload[key] === 'object' && payload[key].uri) {
                    formData.append('job_thumbnail', {
                        uri: payload[key].uri,
                        name: payload[key].fileName || 'thumbnail.jpg',
                        type: payload[key].mimeType || 'image/jpeg'
                    });
                    console.log(`✅ Đã gói [FILE ẢNH] ${key}:`, payload[key].fileName);
                } else {
                    console.log(`⏭️ Bỏ qua [FILE ẢNH] ${key} (Vì là ảnh cũ hoặc trống)`);
                }
            }
            else if (payload[key] !== null && payload[key] !== undefined) {
                formData.append(key, String(payload[key]));
                console.log(`✅ Đã gói [Text/Number] ${key}:`, String(payload[key]));
            }
        });


        return formData;
    },
    
    createJobPost: async (payload) => {
        const hasImage = payload.job_thumbnail && typeof payload.job_thumbnail === 'object' && payload.job_thumbnail.uri;

        
        const jsonPayload = { ...payload };
        delete jsonPayload.job_thumbnail;

        
        const createRes = await api.post(endpoints.jobPosts.create, jsonPayload);
        const newJobUuid = createRes.data.uuid; 

        
        if (hasImage) {
            const imageFormData = new FormData();
            imageFormData.append('job_thumbnail', {
                uri: payload.job_thumbnail.uri,
                name: payload.job_thumbnail.fileName || `thumb_${Date.now()}.jpg`,
                type: payload.job_thumbnail.mimeType || 'image/jpeg'
            });

            const patchRes = await api.patch(endpoints.jobPosts.update(newJobUuid), imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return patchRes.data; 
        }

        return createRes.data; 
    },
    
    updateJobPost: async (uuid, payload) => {
        const hasNewImage = payload.job_thumbnail && typeof payload.job_thumbnail === 'object' && payload.job_thumbnail.uri;

        
        const jsonPayload = { ...payload };
        delete jsonPayload.job_thumbnail;

        
        await api.patch(endpoints.jobPosts.update(uuid), jsonPayload);

        
        if (hasNewImage) {
            const imageFormData = new FormData();
            imageFormData.append('job_thumbnail', {
                uri: payload.job_thumbnail.uri,
                name: payload.job_thumbnail.fileName || `thumb_${Date.now()}.jpg`,
                type: payload.job_thumbnail.mimeType || 'image/jpeg'
            });

            const finalRes = await api.patch(endpoints.jobPosts.update(uuid), imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return finalRes.data;
        }

        
        const getRes = await api.get(endpoints.jobPosts.retrieve(uuid));
        return getRes.data;
    },

    deleteJobPost: async (uuid) => {
        const response = await api.delete(endpoints.jobPosts.delete(uuid));
        return response.data;
    }
}