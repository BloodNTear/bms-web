import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLoading } from '../utilities/loadingContext';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7012',
    timeout: 20000,
});

export const useAxiosWithMyBE = () => {
    const { setLoading } = useLoading();

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                //setLoading(true); // Show loading indicator
                return config;
            },
            (error) => {
                setLoading(false); // Hide loading indicator
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => {
                //setLoading(false); // Hide loading indicator
                return response;
            },
            (error) => {
                setLoading(false); // Hide loading indicator
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [setLoading]);

    return axiosInstance;
};