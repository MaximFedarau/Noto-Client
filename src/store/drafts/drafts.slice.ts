import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Record } from '@types';

//Interface for the Initial State
interface DraftsState {
  drafts: Record[];
  isEnd: boolean;
}

export const draftsInitialState: DraftsState = {
  drafts: [],
  isEnd: false,
};

export const draftsSlice = createSlice({
  name: 'draftsSlice',
  initialState: draftsInitialState,
  reducers: {
    addDraft: (state: DraftsState, action: PayloadAction<Record>) => {
      // if user does not see the draft, then we do not change state - new draft will be shown when user scrolls to the end
      if (!state.isEnd) {
        return state;
      }
      state.drafts.push(action.payload);
    },
    addDrafts: (state: DraftsState, action: PayloadAction<Record[]>) => {
      state.drafts.push(...action.payload);
    },
    removeDraft: (state: DraftsState, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter(
        (draft) => draft.id !== action.payload,
      );
    },
    updateDraft: (state: DraftsState, action: PayloadAction<Record>) => {
      const { drafts } = state;
      // if user does not see the draft, then we just remove it - saved draft will be shown when user scrolls to the end
      if (!state.isEnd) {
        state.drafts = drafts.filter((draft) => draft.id !== action.payload.id);
        return;
      }
      const index = drafts.findIndex((draft) => draft.id === action.payload.id);
      if (index !== -1) {
        const length = drafts.length;
        if (length > 1 && index < length - 1) {
          drafts.splice(index, 1);
          drafts.push(action.payload);
          return;
        }
        drafts[index] = action.payload;
      } else {
        drafts.push(action.payload);
      }
    },
    assignDrafts: (state: DraftsState, action: PayloadAction<Record[]>) => {
      state.drafts = action.payload;
    },
    clearDrafts: () => draftsInitialState,
    setIsEnd: (state: DraftsState, action: PayloadAction<boolean>) => {
      state.isEnd = action.payload;
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
