/**
 * Slice handles tracking of the favorites categories.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { loadFavorites as loadFavoritesFromFB } from '../firebase/db';
import { RootState } from './store';
import { Favorite, FirebaseError } from './types';

interface FavoritesState {
  data: Favorite[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | undefined;
}

// Define the initial state of the app
const initialState: FavoritesState = {
  data: [],
  loading: 'idle',
  error: undefined,
};

/**
 * Async Thunk: loadCategories
 * This little Thunk fetches the users categories from firebase.
 */
export const loadFavorites = createAsyncThunk<
  Favorite[],
  string,
  {
    rejectValue: FirebaseError;
  }
>('favorite/loadFavorites', async (uid, { rejectWithValue }) => {
  // Fetch the favorites from firebase
  try {
    // Retrieve firebase data
    const snapshot = await loadFavoritesFromFB(uid);
    // If there are no results return an empty array
    if (snapshot.empty) return [];

    // If there are results return those results
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    return rejectWithValue({
      errorMessage:
        'Unable to retrieve your favorites, please try again later.',
    } as FirebaseError);
  }
});

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Actions for loadCategories
    builder.addCase(loadFavorites.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(loadFavorites.rejected, (state, action) => {
      state.error = action.payload?.errorMessage;
      state.loading = 'failed';
    });
    builder.addCase(loadFavorites.pending, (state, action) => {
      state.loading = 'pending';
    });
  },
});

// export const {  } = categoriesSlice.actions;
export const selectFavorites = (state: RootState) => state.favorites.data;
export default favoritesSlice.reducer;
