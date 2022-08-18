import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store/store';

const publicDataReducerSelector = (state: RootState) => state.drafts;

export const draftsSelector = createSelector(
  publicDataReducerSelector,
  (drafts) => drafts,
);
