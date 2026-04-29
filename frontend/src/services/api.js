import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CLIENT_ID, CLIENT_SECRET, STORAGE_KEYS, BASE_URL } from "../constants/config";

const api = axios.create({
    baseURL : BASE_URL,
    headers : {'Content-Type' : 'application/json'},
})

// add token to header
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

                const refreshRespone = await axios.post(`${BASE_URL}/o/token/`,{
                    grant_type : 'refresh_token',
                    refresh_token : refreshToken,
                    client_id : CLIENT_ID,
                    client_secret : CLIENT_SECRET,
                });

                const newAccessToken = refreshRespone.data.access_token;
                const newRefreshToken = refreshRespone.data.refresh_token;

                await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN,newAccessToken);
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN,newRefreshToken);
                
                originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalConfig)
            }
            catch (refreshError){
                await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
        
)

export default api;