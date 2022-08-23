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
    updateNote: (state: NoteSchema[], action: PayloadAction<NoteSchema>) => {
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
    assignNotes: (_: NoteSchema[], action: PayloadAction<NoteSchema[]>) => {
      return action.payload;
    },
    clearNotes: () => notesInitialState,
  },
});

export const { addNote, removeNote, updateNote, assignNotes, clearNotes } =
  notesSlice.actions;
