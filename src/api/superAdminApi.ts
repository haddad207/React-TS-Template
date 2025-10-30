import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi.ts";
import type UserResponse from "../models/admin/UserResponse.ts";
import type RegisterUserRequest from "../models/admin/RegisterUserRequest.ts";
import type PromotionResponse from "../models/admin/roles/PromotionResponse.ts";
import type DemotionResponse from "../models/admin/roles/DemotionResponse.ts";
import type UserLockRequest from "../models/admin/user_lock/UserLockRequest.ts";
import type ChangeOwnPasswordRequest from "../models/admin/password/ChangeOwnPasswordRequest.ts";
import type ResetUserPasswordRequest from "../models/admin/password/ResetUserPasswordRequest.ts";
import type DeleteResponse from "../models/admin/delete/DeleteResponse.ts";
import type PasswordHandlingResponse from "../models/admin/password/PasswordHandlingResponse.ts";
import type UserLockResponse from "../models/admin/user_lock/UserLockResponse.ts";

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("Token");
};

export const superAdminApi = createApi({
  reducerPath: "superAdminApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["SuperAdminUser"],
  endpoints: (builder) => ({
    getAllUsersAsSuper: builder.query<UserResponse[], void>({
      query: () => ({
        url: `superadmin/users`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      providesTags: ["SuperAdminUser"],
    }),
    createUserAsSuper: builder.mutation<UserResponse, RegisterUserRequest>({
      query: (userData) => ({
        url: `superadmin/users`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: userData,
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    promoteUserToAdmin: builder.mutation<PromotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/promote-to-admin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    promoteUserToSuperAdmin: builder.mutation<PromotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/promote-to-superadmin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    demoteAdmin: builder.mutation<DemotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/demote-admin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    demoteSuperAdmin: builder.mutation<DemotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/demote-superadmin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    setUserLockAsSuper: builder.mutation<UserLockResponse, UserLockRequest>({
      query: ({ userId, isUnlocked }) => ({
        url: `superadmin/users/${userId}/lock`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: isUnlocked,
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    deleteUserAsSuper: builder.mutation<DeleteResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
    changeOwnPasswordAsSuper: builder.mutation<
      PasswordHandlingResponse,
      ChangeOwnPasswordRequest
    >({
      query: (passwordData) => ({
        url: `superadmin/users/self/change-password`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: passwordData,
      }),
    }),
    resetUserPasswordAsSuper: builder.mutation<
      PasswordHandlingResponse,
      { userId: string; data: ResetUserPasswordRequest }
    >({
      query: ({ userId, data }) => ({
        url: `superadmin/users/${userId}/reset-password`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["SuperAdminUser"],
    }),
  }),
});

export const {
  useGetAllUsersAsSuperQuery,
  useCreateUserAsSuperMutation,
  usePromoteUserToAdminMutation,
  usePromoteUserToSuperAdminMutation,
  useDemoteAdminMutation,
  useDemoteSuperAdminMutation,
  useSetUserLockAsSuperMutation,
  useDeleteUserAsSuperMutation,
  useResetUserPasswordAsSuperMutation,
} = superAdminApi;
