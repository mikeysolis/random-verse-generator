import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Verse } from './types';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GET_RANDOM_VERSES_FROM_VOLUME } from '../../lib/apollo/queries';

interface VersesState {
  data: Verse[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: VersesState = {
  data: [],
  loading: 'idle',
};

export const concatVerses = createAsyncThunk<
  Verse[],
  number,
  {
    extra: { client: ApolloClient<NormalizedCacheObject> };
  }
>('verse/concatVerses', async (volumeId, { extra }) => {
  const { client } = extra;

  try {
    const response = await client.query({
      query: GET_RANDOM_VERSES_FROM_VOLUME,
      fetchPolicy: 'no-cache',
      variables: {
        limit: 10,
        volumeId,
      },
    });

    return response.data.get_random_verses_from_volume;
  } catch (error) {
    console.log('error: ', error);
    return [];
  }
});

export const versesSlice = createSlice({
  name: 'verses',
  initialState,
  reducers: {
    concat: (state, action: PayloadAction<Verse[]>) => {
      const newVerses = state.data.concat(action.payload);
      state.data = newVerses;
    },
    clear: state => {
      state.data = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(concatVerses.fulfilled, (state, action) => {
      const newVerses = state.data.concat(action.payload);
      state.loading = 'succeeded';
      state.data = newVerses;
    });
    builder.addCase(concatVerses.rejected, (state, action) => {
      state.loading = 'failed';
    });
    builder.addCase(concatVerses.pending, (state, action) => {
      state.loading = 'pending';
    });
  },
});

export const { concat, clear } = versesSlice.actions;
export const selectVerses = (state: RootState) => state.verses.data;
export default versesSlice.reducer;
