import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store';

const socketReducerSelector = ({ socket }: RootState) => socket;

export const socketSelector = createSelector(
  socketReducerSelector,
  ({ socket }) => socket,
);
