import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../constants/endpoints";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from "../constants/config";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading,setIsLoading] = useState(true);
    const [user,setUser] = useState(null);


    const fetchCurrentUser = async() =>{
        try {
            const respone = await api.get(endpoints.users.currentUser);
            setUser(await respone.data)
        }
        catch (error) {
            console.log("fetch user data error,",error)
            setUser(null);
        }
    }

    const checkAuthStatus = async () => {
        try {
            const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            if (accessToken) {
                await fetchCurrentUser();
            }
        }
        catch (error) {
            console.log('err',error);
            setUser(null);
        } 
        finally {
            setIsLoading(false);
        }
    };

    useEffect( ()=>{
       checkAuthStatus()
    },[])
    
    // save token, get user context
    const onLoginSuccess = async (accessToken,refreshToken) =>{
        try {
            setIsLoading(true);
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN,accessToken);
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN,refreshToken);

            await fetchCurrentUser();
        }
        catch(error){
            console.log("login error: ", error);
        }
        finally{
            setIsLoading(false)
        }
    }   

    const logout = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            setUser(null);

        }
        catch (error) {
            console.log('logout error: ',error);
        }
        finally{
            setIsLoading(false);
        }
    }
    return (
        <AuthContext.Provider value = {{user,isLoading,onLoginSuccess,logout}}>
            {children}
        </AuthContext.Provider>
    )

}


