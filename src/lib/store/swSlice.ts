import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface SWState {
  serviceWorkerInitialized: boolean;
  serviceWorkerUpdated: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

const initialState: SWState = {
  serviceWorkerInitialized: false,
  serviceWorkerUpdated: false,
  serviceWorkerRegistration: null,
};

export const swSlice = createSlice({
  name: 'sw',
  initialState,
  reducers: {
    swUpdate: (state, action: PayloadAction<ServiceWorkerRegistration>) => {
      state.serviceWorkerUpdated = !state.serviceWorkerUpdated;
      state.serviceWorkerRegistration = action.payload;
    },
    swInit: state => {
      state.serviceWorkerInitialized = !state.serviceWorkerInitialized;
    },
  },
});

export const { swUpdate, swInit } = swSlice.actions;
export const selectSW = (state: RootState) => state.sw;
export default swSlice.reducer;
