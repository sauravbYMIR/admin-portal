/* eslint-disable no-underscore-dangle */
import type { AxiosInstance } from 'axios';
import axios from 'axios';

import {
  handleGetLocalStorage,
  handleRemoveFromLocalStorage,
  handleSetLocalStorage,
} from './global';

const baseURL = process.env.BASE_URL;

export const renewToken = async (refreshToken: string) => {
  return axios.get(`${baseURL}/auth/refresh-token`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};

// const redirectLogin = () => {
//   window.location.href = "/";
// };

export const handleSignout = (axiosInstance: AxiosInstance | undefined) => {
  handleRemoveFromLocalStorage({ tokenKey: 'access_token' });
  handleRemoveFromLocalStorage({ tokenKey: 'refresh_token' });
  if (axiosInstance) {
    // eslint-disable-next-line no-param-reassign
    delete axiosInstance.defaults.headers.common.Authorization;
  }
  // redirectLogin();
};

const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
});

// Interceptor for request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = handleGetLocalStorage({ tokenKey: 'access_token' });
    if (config.headers) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor for response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshToken = handleGetLocalStorage({
            tokenKey: 'refresh_token',
          });
          if (refreshToken) {
            const res = await renewToken(refreshToken);
            if (res.status !== 200) {
              handleSignout(axiosInstance);
              return await Promise.reject(error);
            }
            if (res.status === 200) {
              handleSetLocalStorage({
                tokenValue: res.data.accessToken,
                tokenKey: 'access_token',
              });
            }
            originalConfig.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return await axiosInstance(originalConfig);
          }
          handleSignout(axiosInstance);
          return await Promise.reject(error);
        } catch (errorObj) {
          handleSignout(axiosInstance);
          return Promise.reject(errorObj);
        }
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
