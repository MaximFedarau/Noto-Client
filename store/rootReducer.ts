//RTK
import { combineReducers } from '@reduxjs/toolkit';

//Slices
import { publicDataSlice } from '@store/publicData/publicData.slice';
import { notesSlice } from './notes/notes.slice';

export const rootReducer = combineReducers({
  publicData: publicDataSlice.reducer,
  notes: notesSlice.reducer,
});
