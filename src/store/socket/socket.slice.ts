import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface State {
  socket?: Socket;
}

const initialState: State = {};

export const socketSlice = createSlice({
  name: 'socketSlice',
  initialState,
  reducers: {
    setSocket: (state, { payload }: PayloadAction<Socket>) => {
      (state as State).socket = payload;
    },
    removeSocket: (state) => {
      state.socket = undefined;
    },
  },
});

export const { setSocket, removeSocket } = socketSlice.actions;
