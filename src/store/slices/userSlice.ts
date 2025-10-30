import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type Token from "../../models/auth/Token.ts";
import router from "../../routes/router.tsx";
import type UserState from "../../models/stores/UserState.ts";

const initialState: UserState = {
  fullName: "",
  email: "",
  expirationTime: new Date().toISOString(),
  token: "",
  refreshToken: "",
  refreshTokenExpirationTime: new Date().toISOString(),
  role: [],
  isLoggedIn: false,
  resetPasswordUserEmail: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Token>) => {
      state.email = action.payload.email;
      state.expirationTime = action.payload.expirationTime;
      state.fullName = action.payload.fullName;
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
      state.refreshTokenExpirationTime =
        action.payload.refreshTokenExpirationDateTime;
      state.role = action.payload.role;
      state.isLoggedIn = true;

      localStorage.setItem("FullName", state.fullName);
      localStorage.setItem("Token", state.token);
      localStorage.setItem("TokenExpirationTime", state.expirationTime);
      localStorage.setItem("RefreshToken", state.refreshToken);
      localStorage.setItem(
        "RefreshTokenExpirationTime",
        state.refreshTokenExpirationTime
      );
      localStorage.setItem("Email", state.email);
      localStorage.setItem("Roles", JSON.stringify(state.role));
      localStorage.setItem("IsLoggedIn", "true");
    },
    updateUser: (state, action: PayloadAction<Token>) => {
      state.email = action.payload.email;
      state.expirationTime = action.payload.expirationTime;
      state.fullName = action.payload.fullName;
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
      state.refreshTokenExpirationTime =
        action.payload.refreshTokenExpirationDateTime;
      state.role = action.payload.role;
      state.isLoggedIn = true;

      localStorage.setItem("FullName", state.fullName);
      localStorage.setItem("Token", state.token);
      localStorage.setItem("TokenExpirationTime", state.expirationTime);
      localStorage.setItem("RefreshToken", state.refreshToken);
      localStorage.setItem(
        "RefreshTokenExpirationTime",
        state.refreshTokenExpirationTime
      );
      localStorage.setItem("Email", state.email);
      localStorage.setItem("Roles", JSON.stringify(state.role));
      localStorage.setItem("IsLoggedIn", "true");
    },
    logoutUser: (state) => {
      Object.assign(state, initialState);

      const keysToRemove = [
        "Token",
        "TokenExpirationTime",
        "RefreshToken",
        "FullName",
        "RefreshTokenExpirationTime",
        "Roles",
        "Email",
      ];

      keysToRemove.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });

      localStorage.setItem("IsLoggedIn", "false");
      router.navigate("/login");
    },
    setResetPasswordUserEmail: (
      state,
      action: PayloadAction<{ userEmail: string }>
    ) => {
      state.resetPasswordUserEmail = action.payload.userEmail;
    },
    removeResetPasswordUserEmail: (state) => {
      state.resetPasswordUserEmail = "";
    },
  },
});

export const {
  login,
  logoutUser,
  updateUser,
  setResetPasswordUserEmail,
  removeResetPasswordUserEmail,
} = userSlice.actions;
