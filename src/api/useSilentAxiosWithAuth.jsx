import { useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/authContext';

const silentAxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 20000,
});

export const useSilentAxiosWithAuth = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = silentAxiosInstance.interceptors.request.use(
            (config) => {
                if (auth?.token && config.url !== "account/login") {
                    config.headers["Authorization"] = `Bearer ${auth.token}`;
                }
                config.headers["Content-Type"] = "application/json";
                config.withCredentials = true;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = silentAxiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    navigate('/');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            silentAxiosInstance.interceptors.request.eject(requestInterceptor);
            silentAxiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [auth, navigate]);

    return silentAxiosInstance;
};
