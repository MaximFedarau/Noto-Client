import * as SecureStore from 'expo-secure-store';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export const createAPIRefreshInstance = (onExit?: () => void) => {
  const refreshInstance = axios.create({
    baseURL: `${process.env.API_URL}`,
  });

  refreshInstance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      (config.headers ??= {}).Authorization = `Bearer ${refreshToken}`;
      return config;
    },
  );

  refreshInstance.interceptors.response.use(
    (config: AxiosResponse) => config,
    async (error) => {
      if (error.response.status === 401) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
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
    const accessToken = await SecureStore.getItemAsync('accessToken');
    (config.headers ??= {}).Authorization = `Bearer ${accessToken}`;
    return config;
  });

  instance.interceptors.response.use(
    (config: AxiosResponse) => config,
    async (error) => {
      if (error.response.status === 401) {
        const res = await refreshInstance.post(`/auth/token/refresh`);
        await SecureStore.setItemAsync('accessToken', res.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
        return instance.request(error.config);
      }
      throw error;
    },
  );
  return instance;
};

createAPIInstance.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
