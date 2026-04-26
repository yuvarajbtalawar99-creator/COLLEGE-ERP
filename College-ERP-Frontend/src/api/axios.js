import originalAxios from 'axios';
import { supabase } from '../lib/supabase';

let cachedAccessToken = null;

export const setApiAccessToken = (token) => {
    cachedAccessToken = token || null;
};

const api = originalAxios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 12000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        let token = cachedAccessToken;
        if (!token && supabase) {
            const { data } = await supabase.auth.getSession();
            token = data.session?.access_token || null;
            if (token) {
                cachedAccessToken = token;
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (config.headers?.Authorization) {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
