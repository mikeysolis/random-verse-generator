import { configureStore } from '@reduxjs/toolkit';
import versesReducer from './versesSlice';

const store = configureStore({
  reducer: {
    verses: versesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
