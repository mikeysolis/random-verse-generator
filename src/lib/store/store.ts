import { configureStore, Middleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import versesReducer from './versesSlice';
import swReducer from './swSlice';
import bookmarksReducer from './bookmarksSlice';
import categoriesReducer from './categoriesSlice';
import favoritesReducer from './favoritesSlice';
import createApolloClient from '../apollo/apolloClient';

// Grab the Apollo client here. We are going to pass it to
// Thunk as an extra argument. Enables us to easily access it
// in our asyncThunk's.
const client = createApolloClient();

// Setup a array to hold optional middlewares
let middleware: Middleware[] = [];

// If we are in the development environment add logger to middleware
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

// Configure our redux store using Redux/toolkit
const store = configureStore({
  reducer: {
    verses: versesReducer,
    sw: swReducer,
    bookmarks: bookmarksReducer,
    categories: categoriesReducer,
    favorites: favoritesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: { extraArgument: { client } },
    }).concat(middleware),
});

// Set up our RootState and AppDispatch types for easy use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
