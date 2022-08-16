import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NoteSchema } from '@app-types/types';

export const notesInitialState: NoteSchema[] = [];

export const notesSlice = createSlice({
  name: 'notesSlice',
  initialState: notesInitialState,
  reducers: {
    addNote: (state: NoteSchema[], action: PayloadAction<NoteSchema>) => {
      state.push(action.payload);
    },
    removeNote: (state: NoteSchema[], action: PayloadAction<string>) => {
      return state.filter((note) => note.id !== action.payload);
    },
    assignNotes: (_: NoteSchema[], action: PayloadAction<NoteSchema[]>) => {
      return action.payload;
    },
    clearNotes: () => notesInitialState,
  },
});

export const { addNote, removeNote, assignNotes, clearNotes } =
  notesSlice.actions;
