//RTK
import { combineReducers } from '@reduxjs/toolkit';

//Slices
import { publicDataSlice } from '@store/publicData/publicData.slice';

export const rootReducer = combineReducers({
  publicData: publicDataSlice.reducer,
});
