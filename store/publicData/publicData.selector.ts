import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store/store';

const publicDataReducerSelector = (state: RootState) => state.publicData;

export const publicDataAvatarSelector = createSelector(
  publicDataReducerSelector,
  (state) => state.avatar,
);

export const publicDataNicknameSelector = createSelector(
  publicDataReducerSelector,
  (state) => state.nickname,
);

export const publicDataAuthSelector = createSelector(
  publicDataReducerSelector,
  (state) => state.isAuth,
);