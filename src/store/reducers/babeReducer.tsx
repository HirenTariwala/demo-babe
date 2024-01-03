import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { useAppSelector } from '../useReduxHook';
import { Item } from '@/props/profileProps';

// Define a type for the slice state
export interface IBabe {
  selectedBabe: Item | undefined;
}

// Define the initial state using that type
const initialState: IBabe = {
  selectedBabe: undefined,
};

export const babeSlice = createSlice({
  name: 'babe',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectedBabe: (state, action: PayloadAction<Item>) => {
      state.selectedBabe = action.payload;
    },
  },
});

export const { setSelectedBabe } = babeSlice.actions;

export const useSeletedBabeStore = () => useAppSelector((state: RootState) => state?.babe);

export default babeSlice.reducer;
