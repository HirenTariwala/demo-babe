import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { useAppSelector } from '../useReduxHook';
import { ServiceDetailProps } from '@/props/servicesProps';

// Define a type for the slice state
export interface IService {
  services: ServiceDetailProps[];
}

// Define the initial state using that type
const initialState: IService = {
  services: [],
}

export const servicesSlice = createSlice({
  name: 'services',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ServiceDetailProps[] | null>) => {
      state.services = action.payload|| [];
    },
    
  },
 
});

export const { setServices } = servicesSlice.actions;

export const useServicesStore = () => useAppSelector((state: RootState) => state?.services);

export default servicesSlice.reducer;
