import { combineReducers } from '@reduxjs/toolkit';

import { userSlice } from './user/user.slice';
import { notesSlice } from './notes/notes.slice';
import { draftsSlice } from './drafts/drafts.slice';
import { socketSlice } from './socket/socket.slice';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  notes: notesSlice.reducer,
  drafts: draftsSlice.reducer,
  socket: socketSlice.reducer,
});
