import axios from "axios";
import { BASE_URL, CLIENT_ID, CLIENT_SECRET, STORAGE_KEYS } from "../constants/config";
import { endpoints } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const authServices = {
    login: async (username, password) => {

        const respone = await axios.post(BASE_URL + endpoints.auth.login, {
            username: username,
            password: password,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return respone.data

    },
    register: async (formData) => {

        const respone = await axios.post(BASE_URL + endpoints.auth.register, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        

    },
    logout: async () => {

            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

            if (!refreshToken) throw new Error('no refresh token found');
            if (!accessToken) throw new Error('no accsess token found');

            await axios.post(BASE_URL + endpoints.auth.logout,
                {
                    refresh_token : refreshToken,
                    access_token : accessToken
                }
            )


            
    },
    refresh: async () => {

            refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
            if (!refreshToken) throw new Error('no refresh token found');

            const respone = await axios.post(BASE_URL + endpoints.auth.refresh,{
                refresh_token : refreshToken
            })
            return respone.data
        

    }
}