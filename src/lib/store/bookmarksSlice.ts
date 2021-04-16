import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Verse } from './types';
import { isBookmarked } from '../utils/utils';
import { createStorage, get, set, remove } from '../utils/ionicStorage';

interface BookmarksState {
  data: Verse[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState = {
  data: [],
  loading: 'idle',
} as BookmarksState;

export const loadBookmarks = createAsyncThunk<Verse[]>(
  'bookmark/getBookmarks',
  async () => {
    await createStorage('GeneratorDB');
    const response: Verse[] = await get('bookmarks');

    if (!response) {
      return [];
    }

    return response;
  }
);

export const clearBookmarks = createAsyncThunk(
  'bookmark/clearBookmarks',
  async () => {
    await createStorage('GeneratorDB');
    remove('bookmarks');
  }
);

export const updateBookmarks = createAsyncThunk<
  Verse[],
  Verse,
  { state: { bookmarks: { data: Verse[] } } }
>('bookmark/updateBookmarks', async (bookmark, { getState }) => {
  const { bookmarks } = getState();
  let newBookmarks: Verse[];

  if (isBookmarked(bookmark.verseId, bookmarks.data)) {
    newBookmarks = bookmarks.data.filter(bm => bookmark.verseId !== bm.verseId);
  } else {
    newBookmarks = bookmarks.data.slice();
    newBookmarks.unshift(bookmark);
  }

  await createStorage('GeneratorDB');
  set('bookmarks', newBookmarks);

  return newBookmarks;
});

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadBookmarks.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.data = action.payload;
    });
    builder.addCase(loadBookmarks.rejected, (state, action) => {
      state.loading = 'failed';
      state.data = [];
    });
    builder.addCase(loadBookmarks.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(clearBookmarks.fulfilled, (state, action) => {
      state.data = [];
    });
    builder.addCase(updateBookmarks.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

// export const { loadBookmarks } = bookmarksSlice.actions;
export const selectBookmarks = (state: RootState) => state.bookmarks.data;
export default bookmarksSlice.reducer;
