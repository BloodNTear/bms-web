import { useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import  AuthContext  from '../contexts/authContext';
import { useLoading } from '../utilities/loadingContext';

const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 20000
});

export const useAxiosWithAuth = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { setLoading } = useLoading();

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                setLoading(true); // Show loading indicator
                if (auth?.token && config.url !== "account/login") {
                    config.headers["Authorization"] = `Bearer ${auth.token}`;
                }
                config.headers["Content-Type"] = "application/json";
                config.withCredentials = true;
                return config;
            },
            (error) => {
                setLoading(false); // Hide loading indicator
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => {
                setLoading(false); // Hide loading indicator
                return response;
            },
            (error) => {
                setLoading(false); // Hide loading indicator
                if (error.response?.status === 401) {
                    navigate('/');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [auth, navigate, setLoading]);

    return axiosInstance;
};