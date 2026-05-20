import { BASE_URL } from "./config"

export const endpoints = {
    auth : {
        register : '/auth/sign-up',
        login : '/auth/login',
        refresh : '/auth/refresh',
        logout: '/auth/logout',
    },
    users : {
        currentUser : '/users/me/',
    },
    jobPosts :{
        list : '/job-posts/'
    }
}
