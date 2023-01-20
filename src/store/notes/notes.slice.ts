import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Record } from '@types';

interface State {
  notes: Record[];
  isEnd: boolean;
}

export const initialState: State = {
  notes: [],
  isEnd: false,
};

export const notesSlice = createSlice({
  name: 'notesSlice',
  initialState,
  reducers: {
    addNote: (state, { payload }: PayloadAction<Record>) => {
      const { notes } = state;
      notes.unshift(payload);
    },
    addNotes: ({ notes }, { payload }: PayloadAction<Record[]>) => {
      notes.push(...payload);
    },
    removeNote: (state, { payload }: PayloadAction<string>) => {
      const { notes } = state;
      state.notes = notes.filter(({ id }) => id !== payload);
    },
    updateNote: (state, { payload }: PayloadAction<Record>) => {
      const { notes } = state;
      const index = notes.findIndex(({ id }) => id === payload.id);
      if (index !== -1) {
        notes.splice(index, 1);
        notes.unshift(payload);
      } else notes.unshift(payload);
    },
    assignNotes: (state, { payload }: PayloadAction<Record[]>) => {
      state.notes = payload;
    },
    clearNotes: () => initialState,
    setIsEnd: (state, { payload }: PayloadAction<boolean>) => {
      state.isEnd = payload;
    },
  },
});

export const {
  addNote,
  addNotes,
  removeNote,
  updateNote,
  assignNotes,
  clearNotes,
  setIsEnd,
} = notesSlice.actions;
