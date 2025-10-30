import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type UiState from "../../models/stores/UiState.ts";

const initialState: UiState = {
  isLoading: false,
  autoLogout: false,
  progress: 0,
  invalidRefreshToken: false,
  isDrawerOpen: false,
  showLogoutNotification: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setAutoLogout: (state) => {
      state.autoLogout = !state.autoLogout;
    },
    setProgress: (state) => {
      state.progress = 0;
    },
    updateProgress: (state) => {
      state.progress = state.progress + 2;
    },
    setInvalidRefreshToken: (state, action: PayloadAction<boolean>) => {
      state.invalidRefreshToken = action.payload;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    setLogoutNotification: (state, action: PayloadAction<boolean>) => {
      state.showLogoutNotification = action.payload;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setAutoLogout,
  setProgress,
  updateProgress,
  setInvalidRefreshToken,
  openDrawer,
  closeDrawer,
  setLogoutNotification,
} = uiSlice.actions;
