import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface ScanState {
  idBandNumber: number;
}

const initialState: ScanState = {
  idBandNumber: 0,
};

export const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    handleIdBandNumber: (state, action: PayloadAction<number>) => {
      state.idBandNumber = action.payload;
    },
  },
});

export const scanActions = scanSlice.actions;

export const selectIdBandNumber = (state: RootState) => state.scan.idBandNumber;

export const scanReducer = scanSlice.reducer;
