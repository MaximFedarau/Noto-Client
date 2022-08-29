//RTK
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

//Root Reducer
import { rootReducer } from './rootReducer';

export const listener = createListenerMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listener.middleware),
});

//Types
export type RootState = ReturnType<typeof store.getState>;
