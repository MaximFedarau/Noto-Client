import { getItemAsync } from 'expo-secure-store';
import { io } from 'socket.io-client';

export const createSocket = async () => {
  const accessToken = await getItemAsync('accessToken');
  const socket = io(`${process.env.API_URL}/notes`, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return socket;
};
