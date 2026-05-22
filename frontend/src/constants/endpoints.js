import { BASE_URL } from "./config"

export const endpoints = {
    auth : {
        register : '/auth/sign-up/',
        login : '/auth/login/',
        refresh : '/auth/refresh/',
        logout: '/auth/logout/',
    },
    users : {
        currentUser : '/users/me/',
        search: '/users/',
    },
    jobPosts :{
        list : '/job-posts/',
        retrieve : uuid => `/job-posts/${uuid}/` 
    },
    employerProfile :{
        listJobPost : '/employer-profiles/me/job-posts/',

        ownerProfileJobPosts : '/employer-profiles/me/job-posts/',


        publicProfile : (username) => `/employer-profiles/${username}/`,
        publicProfileJobPosts : (username) => `/employer-profiles/${username}/job-posts/`,
        publicProfileComments : (username) => `/employer-profiles/${username}/comments/`,
        publicProfileFollowers : (username) => `/employer-profiles/${username}/followers/`,
        follow : (username) => `/employer-profiles/${username}/follow/`
    },
    candidateProfile :{

        ownerProfileResumes : '/candidate-profiles/me/resumes/',
        ownerProfileJobApplications : '/candidate-profiles/me/job-applications/',

        publicProfile : (username) => `/candidate-profiles/${username}/`,
        publicProfileResume : (username) => `/candidate-profiles/${username}/resumes/`,
        publicProfileComments : (username) => `/candidate-profiles/${username}/comments/`,
        publicProfileFollowing : (username) => `/candidate-profiles/${username}/following/`,
    }

}
