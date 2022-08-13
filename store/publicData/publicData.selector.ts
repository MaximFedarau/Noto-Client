//Types
import { RootState } from '@store/store';

//RTK
import { createSelector } from '@reduxjs/toolkit';

const publicDataReducerSelector = (state: RootState) => state.publicData;

export const publicDataAvatarSelector = createSelector(
  publicDataReducerSelector,
  (state) => state.avatar,
);

export const publicDataNicknameSelector = createSelector(
  publicDataReducerSelector,
  (state) => state.nickname,
);
