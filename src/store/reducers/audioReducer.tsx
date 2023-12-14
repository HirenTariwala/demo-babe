/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { useAppSelector } from '../useReduxHook';

// Define a type for the slice state
interface AudioProps { 
    voiceUrl?: string
}
export interface AudioType { 
    currentAudio?:  AudioProps
    // setCurrentAudio: (audio?: AudioProps) => void;
}
// Define the initial state using that type
const initialState: AudioType = {
    currentAudio: undefined,
}

export const audioSlice = createSlice({
  name: 'audio',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentAudio: (state, action: PayloadAction<AudioProps>) => {
      state.currentAudio= action.payload;
    },
    
  },
 
});

export const { setCurrentAudio } = audioSlice.actions;

export const useAudioStore = () => useAppSelector((state: RootState) => state?.audio);

export default audioSlice.reducer;
