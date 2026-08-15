import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CLIENT_ID, CLIENT_SECRET, STORAGE_KEYS, BASE_URL } from "../constants/config";
import { endpoints } from "../constants/endpoints";
import { authServices } from "./authService";

const api = axios.create({
    baseURL : BASE_URL,
    headers : {'Content-Type' : 'application/json'},
})
let logout = null;
export const setLogout = (func) => logout = func;

api.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config
    }
)

api.interceptors.response.use(
    (response) => response,

    async (error) =>{
        const originalConfig = error.config;

        if (error.response?.status === 401 && !originalConfig._retry ){
            originalConfig._retry = true;
            
            try {
                const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                if (!refreshToken) throw new Error('no refresh token found');

                const refreshData = await authServices.refresh()

                const newAccessToken = refreshData.access_token;
                const newRefreshToken = refreshData.refresh_token;

                await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN,newAccessToken);
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN,newRefreshToken);
                
                originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalConfig)
            }
            catch (refreshError){
                await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                if (logout) logout();
                return new Promise(() => {});
            }
        }
        return Promise.reject(error);
    }
        
)

export default api;