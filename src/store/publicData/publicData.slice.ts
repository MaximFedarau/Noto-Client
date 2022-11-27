import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@types';

export const publicDataInitialState: User = {
  nickname: '',
  isAuth: false,
  avatar: undefined,
};

export const publicDataSlice = createSlice({
  name: 'publicDataSlice',
  initialState: publicDataInitialState,
  reducers: {
    setPublicData: (state: User, action: PayloadAction<User>) => {
      state.avatar = action.payload.avatar;
      state.nickname = action.payload.nickname;
    },
    setIsAuth: (state: User, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
});

export const { setPublicData, setIsAuth } = publicDataSlice.actions;
