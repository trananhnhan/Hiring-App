import api from './api';
import { endpoints } from '../constants/endpoints';

export const jobApplicationServices = {

  applyForJob: async (jobPostUuid, resumeUuid, message) => {
    const payload = {
      job_post: jobPostUuid,
      resume: resumeUuid,
      message: message
    };
    const response = await api.post(endpoints.jobApplications.create, payload);
    return response.data;
  },


  updateApplication: async (uuid, payload) => {
    const response = await api.patch(
      endpoints.jobApplications.update(uuid),
      payload
    );
    return response.data;
  },
  
  getJobPostDetail: async (jobUuid) => {
    const response = await api.get(endpoints.jobPosts.retrieve(jobUuid));
    return response.data;
  },

  
  getDetail: async (uuid) => {
    const response = await api.get(endpoints.jobApplications.retrieve(uuid));
    return response.data;
  },

  updateApplication: async (uuid, payload) => {
    const response = await api.patch(endpoints.jobApplications.retrieve(uuid), payload);
    return response.data;
  },


  withdrawApplication: async (uuid) => {
    const response = await api.delete(endpoints.jobApplications.retrieve(uuid));
    return response.data;
  },
  getApplicationsByJobPost: async (jobUuid, page = 1) => {
    const response = await api.get(endpoints.jobPosts.applications(jobUuid), { params: { page } });
    return response.data;
  },


  getApplicationComments: async (applicationUuid) => {
    const response = await api.get(endpoints.jobApplications.comments(applicationUuid));
    return response.data;
  },
  createApplicationComment: async (applicationUuid, payload) => {
    
    const response = await api.post(endpoints.jobApplications.comments(applicationUuid), payload);
    return response.data;
  },
  deleteApplicationComment: async (applicationUuid) => {
    
    const response = await api.delete(endpoints.jobApplications.comments(applicationUuid));
    return response.data;
  },
};