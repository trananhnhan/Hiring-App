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
    }
}