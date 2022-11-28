import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store';

const draftsReducerSelector = ({ drafts }: RootState) => drafts;

export const draftsSelector = createSelector(
  draftsReducerSelector,
  ({ drafts }) => drafts,
);

export const isEndSelector = createSelector(
  draftsReducerSelector,
  ({ isEnd }) => isEnd,
);
