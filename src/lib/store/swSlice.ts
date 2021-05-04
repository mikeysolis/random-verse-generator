import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

/**
 * Slice handles changes to the service worker updates.
 * This is neccessary in order to detect app updates and
 * allow the user to update the app.
 */

// Type interface for SWSTate
interface SWState {
  serviceWorkerInitialized: boolean;
  serviceWorkerUpdated: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

// Setup the initial state for SWState
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
