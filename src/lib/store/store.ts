import { configureStore } from '@reduxjs/toolkit';
import versesReducer from './versesSlice';
import swReducer from './swSlice';
import bookmarksSlice from './bookmarksSlice';

const store = configureStore({
  reducer: {
    verses: versesReducer,
    sw: swReducer,
    bookmarks: bookmarksSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
