import { BASE_URL } from "../constants/config"
import { endpoints } from "../constants/endpoints"
import api from "./api"



export const profileServices = {


  getMyResumes: async (page = 1) => {
    const response = await api.get(endpoints.candidateProfile.ownerProfileResumes, { params: { page } });
    return response.data;
  },

  getMyApplications: async (page = 1) => {
    const response = await api.get(endpoints.candidateProfile.ownerProfileJobApplications, { params: { page } });
    return response.data;
  },

  getMyJobPosts: async (page = 1) => {
    const response = await api.get(endpoints.employerProfile.ownerProfileJobPosts, { params: { page } });
    return response.data;
  },




  getPublicCandidateProfile: async (username) => {
    const response = await api.get(endpoints.candidateProfile.publicProfile(username));
    return response.data;
  },

  getPublicEmployerProfile: async (username) => {
    const response = await api.get(endpoints.employerProfile.publicProfile(username));
    return response.data;
  },

  getPublicCandidateResumes: async (username, page = 1) => {
    const response = await api.get(endpoints.candidateProfile.publicProfileResume(username), { params: { page } });
    return response.data;
  },

  getPublicEmployerJobPosts: async (username, page = 1) => {
    const response = await api.get(endpoints.employerProfile.publicProfileJobPosts(username), { params: { page } });
    return response.data;
  },

  getPublicCandidateComments: async (username, page = 1) => {
    const response = await api.get(endpoints.candidateProfile.publicProfileComments(username), { params: { page } });
    return response.data;
  },

  getPublicEmployerComments: async (username, page = 1) => {
    const response = await api.get(endpoints.employerProfile.publicProfileComments(username), { params: { page } });
    return response.data;
  },

  getFollowingList: async (username, page = 1) => {
    const response = await api.get(endpoints.candidateProfile.publicProfileFollowing(username), { params: { page } });
    return response.data;
  },

  getFollowersList: async (username, page = 1) => {
    const response = await api.get(endpoints.employerProfile.publicProfileFollowers(username), { params: { page } });
    return response.data;
  },
  
  followEmployer: async (username) => {
    const response = await api.post(endpoints.employerProfile.follow(username));
    return response.data;
  },

  searchUsers: async (searchQuery, page = 1) => {
    const response = await api.get(endpoints.users.search, {
      params: {
        search: searchQuery,
        page: page
      }
    });
    return response.data;
  },

  getMe: async () => {
        const response = await api.get(endpoints.users.currentUser);
        return response.data;
    },

    // 2. Cập nhật User Auth (Có gửi File Avatar nên phải dùng FormData)
    updateUser: async (formData) => {
        const response = await api.patch(endpoints.users.currentUser, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    // 3. Cập nhật Candidate Profile (Chỉ gửi text nên dùng JSON bình thường)
    updateCandidateProfile: async (payload) => {
        const response = await api.patch(endpoints.candidateProfile.me, payload);
        return response.data;
    },

    // 4. Cập nhật Employer Profile (Chỉ gửi text nên dùng JSON)
    updateEmployerProfile: async (payload) => {
        const response = await api.patch(endpoints.employerProfile.me, payload);
        return response.data;
    },
};
