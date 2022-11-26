import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store/store';

const socketReducerSelector = (state: RootState) => state.socket;

export const socketSelector = createSelector(
  socketReducerSelector,
  ({ socket }) => socket,
);
