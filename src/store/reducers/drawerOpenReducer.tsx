import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { useAppSelector } from '../useReduxHook';

export interface IDrawerOpen {
  isOpenChatDrawer: boolean;
  isOpenProfileModal: boolean;
}

const initialState: IDrawerOpen = {
  isOpenChatDrawer: false,
  isOpenProfileModal: false,
};

export const drawerOpenSlice = createSlice({
  name: 'drawerOpen',
  initialState,
  reducers: {
    setIsOpenChatDrawer: (state, action: PayloadAction<boolean>) => {
      state.isOpenChatDrawer = action?.payload;
    },
    setIsOpenProfileModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenProfileModal = action?.payload;
    },
  },
});

export const { setIsOpenChatDrawer, setIsOpenProfileModal } = drawerOpenSlice.actions;

export const useDrawerOpenStore = () => useAppSelector((state: RootState) => state?.drawerOpen);

export default drawerOpenSlice.reducer;
