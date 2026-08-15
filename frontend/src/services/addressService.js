import api from './api';
import { endpoints } from '../constants/endpoints';

export const addressService = {
    
    getDistricts: async (provinceId) => {
        const response = await api.get(endpoints.locations.districts(provinceId));
        return response.data;
    },
    getWards: async (districtId) => {
        const response = await api.get(endpoints.locations.wards(districtId));
        return response.data;
    },

    
    
    
    createAddress: async (payload) => {
        
        const response = await api.post(endpoints.employerProfile.addressCreate, payload);
        return response.data;
    },
    
    updateAddress: async (uuid, payload) => {
        
        const response = await api.patch(endpoints.employerProfile.addressUpdate(uuid), payload);
        return response.data;
    },
    
    deleteAddress: async (uuid) => {
        
        const response = await api.delete(endpoints.employerProfile.addressDelete(uuid));
        return response.data;
    }
};