//RTK
import { configureStore } from '@reduxjs/toolkit';

//Root Reducer
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
});

//Types
export type RootState = ReturnType<typeof store.getState>;
