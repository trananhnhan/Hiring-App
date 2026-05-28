import { BASE_URL } from "./config"

export const endpoints = {
    auth: {
        register: '/auth/sign-up/',
        login: '/auth/login/',
        refresh: '/auth/refresh/',
        logout: '/auth/logout/',
    },
    users: {
        currentUser: '/users/me/',
        search: '/users/',
    },
    jobPosts: {
        list: '/job-posts/',
        create: '/job-posts/',
        retrieve: uuid => `/job-posts/${uuid}/`,
        update: uuid => `/job-posts/${uuid}/`,
        applications: uuid => `/job-posts/${uuid}/job-applications/`,
        delete: uuid => `/job-posts/${uuid}/`,
        me: '/candidate-profiles/me/',
    },
    employerProfile: {
        listJobPost: '/employer-profiles/me/job-posts/',

        ownerProfileJobPosts: '/employer-profiles/me/job-posts/',
        me: '/employer-profiles/me/',

        publicProfile: (username) => `/employer-profiles/${username}/`,
        publicProfileJobPosts: (username) => `/employer-profiles/${username}/job-posts/`,
        publicProfileComments: (username) => `/employer-profiles/${username}/comments/`,
        publicProfileFollowers: (username) => `/employer-profiles/${username}/followers/`,
        follow: (username) => `/employer-profiles/${username}/follow/`,

        addressCreate: '/employer-profiles/me/addresses/',
        addressUpdate: (uuid) => `/employer-profiles/me/addresses/${uuid}/`,
        addressDelete: (uuid) => `/employer-profiles/me/addresses/${uuid}/`,
    },
    candidateProfile: {

        ownerProfileResumes: '/candidate-profiles/me/resumes/',
        ownerProfileJobApplications: '/candidate-profiles/me/job-applications/',
        me: '/candidate-profiles/me/',


        publicProfile: (username) => `/candidate-profiles/${username}/`,
        publicProfileResume: (username) => `/candidate-profiles/${username}/resumes/`,
        publicProfileComments: (username) => `/candidate-profiles/${username}/comments/`,
        publicProfileFollowing: (username) => `/candidate-profiles/${username}/following/`,
    },

    jobApplications: {
        create: '/job-applications/',
        update: uuid => `/job-applications/${uuid}/`,
        retrieve: uuid => `/job-applications/${uuid}/`,
        comments: (uuid) => `/job-applications/${uuid}/comments/`,
    },
    resumes: {
        create: '/resumes/',
        retrieve: uuid => `/resumes/${uuid}/`,
        update: uuid => `/resumes/${uuid}/`,
        delete: uuid => `/resumes/${uuid}/`,
    },
    locations: {
        districts: (provinceId) => `/provinces/${provinceId}/districts/`,
        wards: (districtId) => `/districts/${districtId}/wards/`,
    },
    verificationRequests: {
        list: '/verification-requests/',
        create: '/verification-requests/',
        detail: (uuid) => `/verification-requests/${uuid}/`,
        verify: (uuid) => `/verification-requests/${uuid}/verify/`,
    },
    stats: {
        statsMe : 'stats/me'
    }
}
