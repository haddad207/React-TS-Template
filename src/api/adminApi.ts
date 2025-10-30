import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi.ts";
import type UserResponse from "../models/admin/UserResponse.ts";
import type RegisterUserRequest from "../models/admin/RegisterUserRequest.ts";
import type PromotionResponse from "../models/admin/roles/PromotionResponse.ts";
import type DemotionResponse from "../models/admin/roles/DemotionResponse.ts";
import type DeleteResponse from "../models/admin/delete/DeleteResponse.ts";
import type PasswordHandlingResponse from "../models/admin/password/PasswordHandlingResponse.ts";
import type ChangeOwnPasswordRequest from "../models/admin/password/ChangeOwnPasswordRequest.ts";
import type ResetUserPasswordRequest from "../models/admin/password/ResetUserPasswordRequest.ts";
import type ImportPersonnelResponse from "../models/admin/ImportPersonnelResponse.ts";
import type UserLockResponse from "../models/admin/user_lock/UserLockResponse.ts";
import type UserLockRequest from "../models/admin/user_lock/UserLockRequest.ts";

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("Token");
};


export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserResponse[], void>({
      query: () => ({
        url: `admin/users`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<UserResponse, RegisterUserRequest>({
      query: (userData) => ({
        url: `admin/users`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    promoteUser: builder.mutation<PromotionResponse, string>({
      query: (userId) => ({
        url: `admin/users/${userId}/promote`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    promoteToAdmin: builder.mutation<PromotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/promote-to-admin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    promoteToSuperAdmin: builder.mutation<PromotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/promote-to-superadmin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    demoteUser: builder.mutation<DemotionResponse, string>({
      query: (userId) => ({
        url: `admin/users/${userId}/demote`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    demoteAdmin: builder.mutation<DemotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/demote-admin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    demoteSuperAdmin: builder.mutation<DemotionResponse, string>({
      query: (userId) => ({
        url: `superadmin/users/${userId}/demote-superadmin`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    setUserLock: builder.mutation<UserLockResponse, UserLockRequest>({
      query: ({ userId, isUnlocked }) => ({
        url: `admin/users/${userId}/lock`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: isUnlocked,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<DeleteResponse, string>({
      query: (userId) => ({
        url: `admin/users/${userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    changeOwnPassword: builder.mutation<PasswordHandlingResponse, ChangeOwnPasswordRequest>({
      query: (passwordData) => ({
        url: `admin/users/self/change-password`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: passwordData,
      }),
    }),
    resetUserPassword: builder.mutation<PasswordHandlingResponse, { userId: string; data: ResetUserPasswordRequest }>({
      query: ({ userId, data }) => ({
        url: `admin/users/${userId}/reset-password`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    alamo: builder.mutation<any, { engage: boolean; alamoSecret: string }>({
      query: ({ engage, alamoSecret }) => ({
        url: `admin/users/alamo`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          "Content-Type": "application/json",
          "X-Alamo-Secret": alamoSecret,
        },
        body: engage,
      }),
      invalidatesTags: ["User"],
    }),
    importPersonnelCsv: builder.mutation<any, ImportPersonnelResponse>({
      query: ({ file, mode = "AddOnly", confirmDelete = false }) => {
        const formData = new FormData();
        formData.append("File", file);

        return {
          url: `admin/personnel/import?mode=${mode}&confirmDelete=${confirmDelete}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  usePromoteUserMutation,
  usePromoteToAdminMutation,
  usePromoteToSuperAdminMutation,
  useDemoteUserMutation,
  useDemoteAdminMutation,
  useDemoteSuperAdminMutation,
  useSetUserLockMutation,
  useDeleteUserMutation,
  useChangeOwnPasswordMutation,
  useResetUserPasswordMutation,
  useAlamoMutation,
  useImportPersonnelCsvMutation,
} = adminApi;
