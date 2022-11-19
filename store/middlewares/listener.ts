import {
  createListenerMiddleware,
  TypedStartListening,
} from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '@store/store';

export const listener = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
