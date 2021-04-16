import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Verse } from './types';
interface VersesState {
  data: Verse[];
}

const initialState: VersesState = {
  data: [],
};

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
});

export const { concat, clear } = versesSlice.actions;
export const selectVerses = (state: RootState) => state.verses.data;
export default versesSlice.reducer;
