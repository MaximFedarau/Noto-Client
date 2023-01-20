import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Record } from '@types';

interface State {
  drafts: Record[];
  isEnd: boolean;
}

const initialState: State = {
  drafts: [],
  isEnd: false,
};

export const draftsSlice = createSlice({
  name: 'draftsSlice',
  initialState,
  reducers: {
    addDraft: (state, { payload }: PayloadAction<Record>) => {
      const { drafts } = state;
      drafts.unshift(payload);
    },
    addDrafts: ({ drafts }, { payload }: PayloadAction<Record[]>) => {
      drafts.push(...payload);
    },
    removeDraft: (state, { payload }: PayloadAction<string>) => {
      const { drafts } = state;
      state.drafts = drafts.filter(({ id }) => id !== payload);
    },
    updateDraft: (state, { payload }: PayloadAction<Record>) => {
      const { drafts } = state;
      const index = drafts.findIndex(({ id }) => id === payload.id);
      if (index !== -1) {
        drafts.splice(index, 1);
        drafts.unshift(payload);
      } else drafts.unshift(payload);
    },
    assignDrafts: (state, { payload }: PayloadAction<Record[]>) => {
      state.drafts = payload;
    },
    clearDrafts: () => initialState,
    setIsEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.isEnd = payload;
    },
  },
});

export const {
  addDraft,
  addDrafts,
  removeDraft,
  updateDraft,
  assignDrafts,
  clearDrafts,
  setIsEnd,
} = draftsSlice.actions;
