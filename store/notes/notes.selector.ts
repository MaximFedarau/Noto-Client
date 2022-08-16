import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store/store';

const publicDataReducerSelector = (state: RootState) => state.notes;

export const notesSelector = createSelector(
  publicDataReducerSelector,
  (notes) => notes,
);
