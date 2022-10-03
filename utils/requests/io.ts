import * as SecureStore from 'expo-secure-store';
import { io } from 'socket.io-client';

export const createSocket = async () => {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  const socket = io(`${process.env.API_URL}/notes`, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return socket;
};

createSocket.defaultProps = {
  API_URL: (process.env.API_URL = 'http://localhost:5000'),
};
