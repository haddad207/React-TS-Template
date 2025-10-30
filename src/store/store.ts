// store.ts
import { configureStore } from "@reduxjs/toolkit";
// import { authApi } from "../api/authApi.ts";
// import { propertyApi } from "../api/propertyApi.ts";
import { uiSlice } from "./slices/uiSlice.ts";
import { userSlice } from "./slices/userSlice.ts";

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { authApi } from "../api/authApi.ts";
import { adminApi } from "../api/adminApi.ts";
import { superAdminApi } from "../api/superAdminApi.ts";
// import { subHandReceiptSlice } from "./slices/subHandReceiptSlice.ts";
// import { formsApi } from "../api/formsApi.ts";
// // import { SHRHFormSlice } from "./slices/SHRHFormSlice.ts";
// import { subhandreceiptholderApi } from "../api/subhandreceiptholderApi.ts";
// import { emailApi } from "../api/emailNotification.ts";
// import { notificationSlice } from "./slices/notificationSlice.ts";
// import { subHandReceiptTransactionApi } from "../api/subHandReceiptTransactionApi.ts";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [superAdminApi.reducerPath]: superAdminApi.reducer,
    user: userSlice.reducer,
    ui: uiSlice.reducer,
    // subHandReceipt: subHandReceiptSlice.reducer,
    // notifications: notificationSlice.reducer,
    // SHRHForm: SHRHFormSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      adminApi.middleware,
      superAdminApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
