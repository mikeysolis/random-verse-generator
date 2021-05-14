import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Verse } from './types';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GET_RANDOM_VERSES_FROM_VOLUME } from '../../lib/apollo/queries';

/**
 * Slice handles tracking of the random verses. Also fetches
 * and concats new verses onto the old array.
 */

// Type declaration for verses state
interface VersesState {
  data: Verse[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | undefined;
}

// Define the initial state of the app
const initialState: VersesState = {
  data: [],
  loading: 'idle',
  error: undefined,
};

// Required to use rejectWithValue to detect Apollo errors
interface ApolloError {
  errorMessage: string;
}

/**
 * Async Thunk: concatVerses
 * This little function receives the volumeId from the dispatch and
 * uses the apollo client to fetch and return new verses.
 */
export const concatVerses = createAsyncThunk<
  Verse[],
  string,
  {
    extra: { client: ApolloClient<NormalizedCacheObject> };
    rejectValue: ApolloError;
  }
>('verse/concatVerses', async (volumeId, { extra, rejectWithValue }) => {
  // Grab the Apollo client
  const { client } = extra;
  const id = parseInt(volumeId);

  // Check that the user input falls within excepted values,
  // if not return an error.
  if ([1, 2, 3, 4, 5].filter(n => n === id).length === 0) {
    return rejectWithValue({
      errorMessage: 'Unable to locate Volume, please try again later.',
    } as ApolloError);
  }

  // Fetch the new verses using the client
  try {
    const response = await client.query({
      query: GET_RANDOM_VERSES_FROM_VOLUME,
      fetchPolicy: 'no-cache',
      variables: {
        limit: 10,
        volumeId: id,
      },
    });
    return response.data.get_random_verses_from_volume;
  } catch (error) {
    return rejectWithValue({
      errorMessage: 'Unable to access the database, please try again later.',
    } as ApolloError);
  }
});

export const versesSlice = createSlice({
  name: 'verses',
  initialState,
  reducers: {
    // Set the verses array to empty
    clear: state => {
      state.data = [];
    },
  },
  extraReducers: builder => {
    // Concat the results of async thunk to verses state
    builder.addCase(concatVerses.fulfilled, (state, action) => {
      const newVerses = state.data.concat(action.payload);
      state.loading = 'succeeded';
      state.data = newVerses;
    });
    // Async thunk failed
    builder.addCase(concatVerses.rejected, (state, action) => {
      state.error = action.payload?.errorMessage;
      state.loading = 'failed';
    });
    // Async thunk is still asyncing :)
    builder.addCase(concatVerses.pending, (state, action) => {
      state.loading = 'pending';
    });
  },
});

export const { clear } = versesSlice.actions;
export const selectVerses = (state: RootState) => state.verses.data;
export default versesSlice.reducer;
