import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { AuthTokens } from '@types';

export const createAPIRefreshInstance = (onExit?: () => void) => {
  const refreshInstance = axios.create({
    baseURL: `${process.env.API_URL}`,
  });

  refreshInstance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const refreshToken = await getItemAsync('refreshToken');
      (config.headers ??= {}).Authorization = `Bearer ${refreshToken}`;
      return config;
    },
  );

  refreshInstance.interceptors.response.use(
    (config: AxiosResponse) => config,
    async (error) => {
      if (error.response.status === 401) {
        await deleteItemAsync('accessToken');
        await deleteItemAsync('refreshToken');
        onExit?.();
      }
      throw error;
    },
  );

  return refreshInstance;
};

export const createAPIInstance = (onExit?: () => void) => {
  const refreshInstance = createAPIRefreshInstance(onExit);

  const instance = axios.create({
    baseURL: `${process.env.API_URL}`,
  });

  instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const accessToken = await getItemAsync('accessToken');
    (config.headers ??= {}).Authorization = `Bearer ${accessToken}`;
    return config;
  });

  instance.interceptors.response.use(
    (config: AxiosResponse) => config,
    async (error) => {
      if (error.response.status === 401) {
        const { data } = await refreshInstance.post<AuthTokens>(
          `/auth/token/refresh`,
        );
        await setItemAsync('accessToken', data.accessToken);
        await setItemAsync('refreshToken', data.refreshToken);
        return instance.request(error.config);
      }
      throw error;
    },
  );
  return instance;
};
