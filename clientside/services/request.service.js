import axios from 'axios';
import { API_PREFIX } from '@env';


const authService = {
    get: async (endpoint, token) => {
        try {
            const response = await axios.get(`${API_PREFIX}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                validateStatus: (status) => {
                    return status < 500;
                },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    create: async (endpoint, token, obj) => {
        try {
            const response = await axios.post(`${API_PREFIX}${endpoint}`, JSON.stringify({ ...obj }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                validateStatus: (status) => {
                    return status < 500;
                },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    update: async (endpoint, token, obj) => {
        try {
            const response = await axios.put(`${API_PREFIX}${endpoint}`, JSON.stringify({ ...obj }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                validateStatus: (status) => {
                    return status < 500;
                },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    remove: async (endpoint, token) => {
        try {
            const response = await axios.delete(`${API_PREFIX}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                validateStatus: (status) => {
                    return status < 500;
                },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    authentication: async (username, password) => {
        try {
            const response = await axios.post(`${API_PREFIX}/auth/login`, JSON.stringify({ username, password }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                validateStatus: (status) => {
                    return status < 500;
                },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    },
};

export default authService;
