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

    // 2. Hàm gom data an toàn (Chống sập React Native)
    // 2. Hàm gom data an toàn (Có gắn log để debug)
    buildFormData: (payload) => {
        const formData = new FormData();

        Object.keys(payload).forEach(key => {
            if (key === 'career_fields_id' && Array.isArray(payload[key])) {
                payload[key].forEach(id => {
                    formData.append('career_fields_id', id);
                });
                console.log(`✅ Đã gói [Mảng ID] ${key}:`, payload[key]);
            }
            else if (key === 'work_days') {
                const stringifiedData = JSON.stringify(payload[key]);
                formData.append(key, stringifiedData);
                console.log(`✅ Đã gói [JSON String] ${key}:`, stringifiedData);
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
    // 3. Tạo mới (POST)
    createJobPost: async (payload) => {
        const hasImage = payload.job_thumbnail && typeof payload.job_thumbnail === 'object' && payload.job_thumbnail.uri;

        // Tách JSON payload (Xóa ảnh ra khỏi cục data chữ)
        const jsonPayload = { ...payload };
        delete jsonPayload.job_thumbnail;

        // 💥 NHỊP 1: Gửi POST toàn bộ Text, Lịch, Ngành nghề bằng JSON
        const createRes = await api.post(endpoints.jobPosts.create, jsonPayload);
        const newJobUuid = createRes.data.uuid; // Lấy UUID vừa được tạo ra

        // 💥 NHỊP 2: Nếu có ảnh, bắn thêm 1 lệnh PATCH đắp ảnh vào
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
            return patchRes.data; // Trả về data hoàn chỉnh có ảnh
        }

        return createRes.data; // Nếu không có ảnh thì trả về luôn nhịp 1
    },
    // 4. Cập nhật (PATCH)
    updateJobPost: async (uuid, payload) => {
        const hasNewImage = payload.job_thumbnail && typeof payload.job_thumbnail === 'object' && payload.job_thumbnail.uri;

        // Tách JSON payload
        const jsonPayload = { ...payload };
        delete jsonPayload.job_thumbnail;

        // 💥 NHỊP 1: Gửi PATCH dọn dẹp Lịch làm việc & update text
        await api.patch(endpoints.jobPosts.update(uuid), jsonPayload);

        // 💥 NHỊP 2: Nếu có ảnh mới, bắn thêm nhát PATCH thứ 2
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

        // Kéo lại cục data mới nhất nếu không đắp ảnh
        const getRes = await api.get(endpoints.jobPosts.retrieve(uuid));
        return getRes.data;
    },

    deleteJobPost: async (uuid) => {
        const response = await api.delete(endpoints.jobPosts.delete(uuid));
        return response.data;
    }
}