//RTK
import { combineReducers } from '@reduxjs/toolkit';

//Slices
import { publicDataSlice } from '@store/publicData/publicData.slice';
import { notesSlice } from './notes/notes.slice';
import { draftsSlice } from './drafts/drafts.slice';

export const rootReducer = combineReducers({
  publicData: publicDataSlice.reducer,
  notes: notesSlice.reducer,
  drafts: draftsSlice.reducer,
});
