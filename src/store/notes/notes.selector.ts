import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store';

const notesReducerSelector = ({ notes }: RootState) => notes;

export const notesSelector = createSelector(
  notesReducerSelector,
  ({ notes }) => notes,
);

export const isEndSelector = createSelector(
  notesReducerSelector,
  ({ isEnd }) => isEnd,
);
