import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DraftSchema } from '@app-types/types';

export const draftsInitialState: DraftSchema[] = [];

export const draftsSlice = createSlice({
  name: 'draftsSlice',
  initialState: draftsInitialState,
  reducers: {
    addDraft: (state: DraftSchema[], action: PayloadAction<DraftSchema>) => {
      state.push(action.payload);
    },
    removeDraft: (state: DraftSchema[], action: PayloadAction<string>) => {
      return state.filter((note) => note.id !== action.payload);
    },
    updateDraft: (state: DraftSchema[], action: PayloadAction<DraftSchema>) => {
      const index = state.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        const length = state.length;
        if (length > 1 && index < length - 1) {
          state.splice(index, 1);
          state.push(action.payload);
          return;
        }
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    assignDrafts: (_: DraftSchema[], action: PayloadAction<DraftSchema[]>) => {
      return action.payload;
    },
  },
});

export const { addDraft, removeDraft, updateDraft, assignDrafts } =
  draftsSlice.actions;
