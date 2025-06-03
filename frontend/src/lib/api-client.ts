import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    try{
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 401 && !window.location.href?.includes('/auth/login')) {
        window.location.href = '/auth/login';
        return
      }
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
      
      

      return Promise.reject(error);
    }catch(err){
      return Promise.reject(error);
    }
  },
);
