import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import versesReducer from './versesSlice';
import swReducer from './swSlice';
import bookmarksReducer from './bookmarksSlice';

const store = configureStore({
  reducer: {
    verses: versesReducer,
    sw: swReducer,
    bookmarks: bookmarksReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
