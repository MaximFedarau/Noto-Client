import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NoteSchema } from '@app-types/types';

//Interface for the Initial State
interface NotesState {
  notes: NoteSchema[];
  isEnd: boolean;
}

export const notesInitialState: NotesState = {
  notes: [],
  isEnd: false,
};

export const notesSlice = createSlice({
  name: 'notesSlice',
  initialState: notesInitialState,
  reducers: {
    addNote: (state: NotesState, action: PayloadAction<NoteSchema>) => {
      // if user does not see the note, then we do not change state - new note will be shown when user scrolls to the end
      if (!state.isEnd) {
        return state;
      }
      state.notes.push(action.payload);
    },
    addNotes: (state: NotesState, action: PayloadAction<NoteSchema[]>) => {
      state.notes = [...state.notes, ...action.payload];
    },
    removeNote: (state: NotesState, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateNote: (state: NotesState, action: PayloadAction<NoteSchema>) => {
      const { notes } = state;
      // if user does not see the note, then we just remove it - saved note will be shown when user scrolls to the end
      if (!state.isEnd) {
        state.notes = notes.filter((note) => note.id !== action.payload.id);
        return;
      }
      const index = notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        const length = notes.length;
        if (length > 1 && index < length - 1) {
          notes.splice(index, 1);
          notes.push(action.payload);
          return;
        }
        notes[index] = action.payload;
      } else {
        notes.push(action.payload);
      }
    },
    assignNotes: (state: NotesState, action: PayloadAction<NoteSchema[]>) => {
      state.notes = action.payload;
    },
    clearNotes: () => notesInitialState,
    setIsEnd: (state: NotesState, action: PayloadAction<boolean>) => {
      state.isEnd = action.payload;
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
