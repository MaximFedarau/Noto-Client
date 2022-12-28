import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './rootReducer';
import { listener } from './middlewares/listener';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // set to false, becase we have global socket variable
    }).prepend(listener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
