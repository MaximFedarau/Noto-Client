import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store';

const userReducerSelector = ({ user }: RootState) => user;

export const userAvatarSelector = createSelector(
  userReducerSelector,
  ({ avatar }) => avatar,
);

export const userNicknameSelector = createSelector(
  userReducerSelector,
  ({ nickname }) => nickname,
);

export const userIsAuthSelector = createSelector(
  userReducerSelector,
  ({ isAuth }) => isAuth,
);
