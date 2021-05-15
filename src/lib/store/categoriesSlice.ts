/**
 * Slice handles tracking of the favorites categories.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  addCategory as addCategoryToFB,
  deleteCategory as deleteCategoryFromFB,
  loadCategories as loadCategoriesFromFB,
} from '../firebase/db';
import { RootState } from './store';
import { Category, FirebaseError } from './types';

interface CategoriesState {
  data: Category[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | undefined;
}

// Define the initial state of the app
const initialState: CategoriesState = {
  data: [],
  loading: 'idle',
  error: undefined,
};

/**
 * Async Thunk: loadCategories
 * This little Thunk fetches the users categories from firebase.
 */
export const loadCategories = createAsyncThunk<
  Category[],
  string,
  {
    rejectValue: FirebaseError;
  }
>('category/loadCategories', async (uid, { rejectWithValue }) => {
  // Fetch the categories from firebase
  try {
    // Retrieve firebase data
    const snapshot = await loadCategoriesFromFB(uid);
    // If there are no results return an empty array
    if (snapshot.empty) return [];

    // If there are results return those results
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    return rejectWithValue({
      errorMessage:
        'Unable to retrieve the categories, please try again later.',
    } as FirebaseError);
  }
});

/**
 * Async Thunk: deleteCategory
 * This little Thunk deletes a single category from firebase
 */
export const deleteCategory = createAsyncThunk<
  Category,
  { uid: string; category: Category },
  { rejectValue: FirebaseError }
>('category/deleteCategory', async ({ uid, category }, { rejectWithValue }) => {
  // Delete the category from firebase
  try {
    await deleteCategoryFromFB(uid, category.id!);
  } catch (error) {
    return rejectWithValue({
      errorMessage: 'Unable to delete the category, please try again later.',
    } as FirebaseError);
  }
  return category;
});

/**
 * Async Thunk: addCategory
 * This little Thunk adds a single category to firebase
 */
export const addCategory = createAsyncThunk<
  Category,
  { uid: string; category: Category },
  { rejectValue: FirebaseError }
>('category/addCategory', async ({ uid, category }, { rejectWithValue }) => {
  // Add the category to firebase
  try {
    await addCategoryToFB(uid, category);
  } catch (error) {
    return rejectWithValue({
      errorMessage: 'Unable to add the category, please try again later.',
    } as FirebaseError);
  }
  return category;
});

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Actions for loadCategories
    builder.addCase(loadCategories.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(loadCategories.rejected, (state, action) => {
      state.error = action.payload?.errorMessage;
      state.loading = 'failed';
    });
    builder.addCase(loadCategories.pending, (state, action) => {
      state.loading = 'pending';
    });
    // Actions for deleteCategory
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.data = state.data.filter(
        category => category.id !== action.payload.id
      );
      state.loading = 'succeeded';
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.payload?.errorMessage;
      state.loading = 'failed';
    });
    builder.addCase(deleteCategory.pending, (state, action) => {
      state.loading = 'pending';
    });
    // Actions for addCategory
    builder.addCase(addCategory.fulfilled, (state, action) => {
      // Check if the new category already exists in state, if so don't re-add it.
      const exists = state.data.some(
        category => category.id === action.payload.id
      );
      if (!exists) {
        state.data.push(action.payload);
      }
      state.loading = 'succeeded';
    });
    builder.addCase(addCategory.rejected, (state, action) => {
      state.error = action.payload?.errorMessage;
      state.loading = 'failed';
    });
    builder.addCase(addCategory.pending, (state, action) => {
      state.loading = 'pending';
    });
  },
});

// export const {  } = categoriesSlice.actions;
export const selectCategories = (state: RootState) => state.categories.data;
export default categoriesSlice.reducer;
