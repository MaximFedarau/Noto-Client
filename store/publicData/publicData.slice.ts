//Types
import { PublicUserData } from '@app-types/types';

//RTK
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const publicDataInitialState: PublicUserData = {
  nickname: '',
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
  },
});

export const { setPublicData } = publicDataSlice.actions;
