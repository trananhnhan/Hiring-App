import axios from "axios";
import { BASE_URL, CLIENT_ID, CLIENT_SECRET } from "../constants/config";
import { endpoints } from "../constants/endpoints";


export const authServices = {
    loginAPI: async (username, password) => {
        try {

            const respone = await axios.post(BASE_URL + endpoints.auth.login, {
                grant_type: 'password',
                username: username,
                password: password,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return respone.data
        }
        catch (error) {
            throw error;
        }

    },
    registerAPI: async (formData) => {
        try {
            const respone = await axios.post(BASE_URL + endpoints.auth.register, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        catch (error) {
            throw error
        }
    }
}