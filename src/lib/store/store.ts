import { configureStore } from '@reduxjs/toolkit';
import versesReducer from './versesSlice';
import swReducer from './swSlice';

const store = configureStore({
  reducer: {
    verses: versesReducer,
    sw: swReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
