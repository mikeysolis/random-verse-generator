import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Verse {
  volumeTitle: string;
  verseTitle: string;
  scriptureText: string;
  verseId: number;
}

interface VersesState {
  verses: Verse[];
}

const initialState: VersesState = {
  verses: [],
};

export const versesSlice = createSlice({
  name: 'verses',
  initialState,
  reducers: {
    concat: (state, action: PayloadAction<Verse[]>) => {
      const newVerses = state.verses.concat(action.payload);
      state.verses = newVerses;
    },
    clear: state => {
      state.verses = [];
    },
  },
});

export const { concat, clear } = versesSlice.actions;
export const selectVerses = (state: RootState) => state.verses.verses;
export default versesSlice.reducer;
