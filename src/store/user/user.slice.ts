import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User, Profile } from '@types';

const initialState: User = {
  nickname: '',
  isAuth: false,
  avatar: undefined,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setProfile: (state, { payload }: PayloadAction<Profile>) => {
      state.avatar = payload.avatar;
      state.nickname = payload.nickname;
    },
    setIsAuth: (state, { payload }: PayloadAction<boolean>) => {
      state.isAuth = payload;
    },
    clearUser: () => initialState,
  },
});

export const { setProfile, setIsAuth, clearUser } = userSlice.actions;
