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
      const { drafts, isEnd } = state;
      // if user does not see the draft, then we do not change state - new draft will be shown when user scrolls to the end
      if (!isEnd) return state;
      drafts.push(payload);
    },
    addDrafts: ({ drafts }, { payload }: PayloadAction<Record[]>) => {
      drafts.push(...payload);
    },
    removeDraft: (state, { payload }: PayloadAction<string>) => {
      const { drafts } = state;
      state.drafts = drafts.filter(({ id }) => id !== payload);
    },
    updateDraft: (state, { payload }: PayloadAction<Record>) => {
      const { drafts, isEnd } = state;
      // if user does not see the draft, then we just remove it - saved draft will be shown when user scrolls to the end
      if (!isEnd) {
        state.drafts = drafts.filter(({ id }) => id !== payload.id);
        return;
      }
      const index = drafts.findIndex(({ id }) => id === payload.id);
      if (index !== -1) {
        const length = drafts.length;
        if (length > 1 && index < length - 1) {
          drafts.splice(index, 1);
          drafts.push(payload);
          return;
        }
        drafts[index] = payload;
      } else drafts.push(payload);
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
