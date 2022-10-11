import { createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

import { createSocket } from '@utils/requests/io';

export const socketSlice = createSlice({
  name: 'socketSlice',
  initialState: {
    socket: undefined as Promise<Socket> | undefined,
  },
  reducers: {
    initSocket: (state) => {
      state.socket = createSocket();
    },
    removeSocket: (state) => {
      state.socket = undefined;
    },
  },
});

export const { initSocket, removeSocket } = socketSlice.actions;
