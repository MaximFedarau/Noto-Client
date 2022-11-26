import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PublicUserData } from '@app-types/types';

export const publicDataInitialState: PublicUserData = {
  nickname: '',
  isAuth: false,
  avatar: undefined,
};

export const publicDataSlice = createSlice({
  name: 'publicDataSlice',
  initialState: publicDataInitialState,
  reducers: {
    setPublicData: (
      state: PublicUserData,
      action: PayloadAction<PublicUserData>,
    ) => {
      state.avatar = action.payload.avatar;
      state.nickname = action.payload.nickname;
    },
    setIsAuth: (state: PublicUserData, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
});

export const { setPublicData, setIsAuth } = publicDataSlice.actions;
