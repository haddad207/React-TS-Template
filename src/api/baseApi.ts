import {
  type BaseQueryApi,
  type FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../store/slices/uiSlice.ts";
import { toast } from "react-toastify";

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD
    ? import.meta.env.VITE_API_PROD_BASE_URL
    : import.meta.env.VITE_API_BASE_URL,
});

export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  // const [logout] = useLogoutMutation();
  //start loading
  api.dispatch(startLoading());

  const result = await customBaseQuery(args, api, extraOptions);
  //stop loading
  api.dispatch(stopLoading());

  if (result.error) {
    const { status, data } = result.error;
    console.log({ status, data });

    if (data === "Invalid refresh token") {
      // await logout;
      toast("Session expired, please sign-in again.", {
        hideProgressBar: true,
        theme: "colored",
        type: "error",
      });
      api.dispatch({ type: "user/logoutUser" });
      // router.navigate("/login");
      // api.dispatch(setInvalidRefreshToken(true));
    }
  }

  return result;
};
