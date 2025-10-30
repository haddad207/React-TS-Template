// Theres a different import for the toolkit which is just /react. That one does not provide the functions we need.
import { createApi } from "@reduxjs/toolkit/query/react";
import type Login from "../models/auth/LoginModel";
import { baseQueryWithErrorHandling } from "./baseApi.ts";
import router from "../routes/router.tsx";
import type LoginResponse from "../models/auth/LoginResponse.ts";
import type ChangePasswordResponse from "../models/auth/password/ChangePasswordResponse.ts";
import type ChangeInitialPasswordRequest from "../models/auth/password/ChangeInitialPasswordRequest.ts";
import type UserResponse from "../models/admin/UserResponse.ts";
import type ForgotPasswordRequest from "../models/auth/password/ForgotPasswordRequest.ts";
import type ResetPasswordConfirmRequest from "../models/auth/password/ResetPasswordConfirmRequest.ts";

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("Token");
};


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, Login>({
      query: (data: Login) => {
        return { url: "auth/login", method: "POST", body: data };
      },
      // async onQueryStarted(_, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled.then(async (data) => {
      //       localStorage.setItem("Token", data.data.token || "");
      //       dispatch(alertsApi.endpoints.currentAlerts.initiate(data.data));
      //     });
      //     // After fetchUser is fulfilled, trigger another query
      //   } catch (error) {
      //     // Handle error if fetchUser fails
      //     console.error("Failed to fetch user:", error);
      //   }
      // },
    }),
    changeInitialPassword: builder.mutation<
      ChangePasswordResponse,
      ChangeInitialPasswordRequest
    >({
      query: (data) => {
        return {
          url: "auth/change-initial-password",
          method: "POST",
          body: data,
        };
      },
    }),
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("Token");
          router.navigate("/login");
        } catch (error) {
          // Even if logout fails, clear local storage and redirect
          localStorage.removeItem("Token");
          router.navigate("/login");
        }
      },
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => {
        return {
          url: "auth/forgot-password",
          method: "POST",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation<void, ResetPasswordConfirmRequest>({
      query: (data) => {
        return {
          url: "auth/reset-password",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useChangeInitialPasswordMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
