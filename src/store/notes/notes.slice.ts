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
      const { notes, isEnd } = state;
      // if user does not see the note, then we do not change state - new note will be shown when user scrolls to the end
      if (!isEnd) return state;
      notes.push(payload);
    },
    addNotes: ({ notes }, { payload }: PayloadAction<Record[]>) => {
      notes.push(...payload);
    },
    removeNote: (state, { payload }: PayloadAction<string>) => {
      const { notes } = state;
      state.notes = notes.filter(({ id }) => id !== payload);
    },
    updateNote: (state, { payload }: PayloadAction<Record>) => {
      const { notes, isEnd } = state;
      // if user does not see the note, then we just remove it - saved note will be shown when user scrolls to the end
      if (!isEnd) {
        state.notes = notes.filter(({ id }) => id !== payload.id);
        return;
      }
      const index = notes.findIndex(({ id }) => id === payload.id);
      if (index !== -1) {
        const length = notes.length;
        if (length > 1 && index < length - 1) {
          notes.splice(index, 1);
          notes.push(payload);
          return;
        }
        notes[index] = payload;
      } else notes.push(payload);
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
