import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useResetPasswordMutation } from "../api/authApi";
import type {
  ResetPasswordFormData,
  ResetPasswordState,
} from "../models/auth/AuthTypes";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPasswordMutation] = useResetPasswordMutation();

  const [state, setState] = useState<ResetPasswordState>({
    message: "",
    error: "",
    email: null,
    token: null,
  });

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setState((prev) => ({
        ...prev,
        error: "Invalid reset link. Please request a new password reset.",
        email: null,
        token: null,
      }));
    } else {
      setState((prev) => ({ ...prev, email, token, error: "", message: "" }));
    }
  }, [searchParams]);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, message: "", error: "" }));
  }, []);

  const submitResetPassword = useCallback(
    async (data: ResetPasswordFormData) => {
      if (!state.email || !state.token) {
        setState((prev) => ({
          ...prev,
          error: "Invalid reset link. Please request a new password reset.",
        }));
        return { success: false };
      }

      setState((prev) => ({ ...prev, message: "", error: "" }));

      try {
        const result = await resetPasswordMutation({
          email: state.email,
          token: encodeURIComponent(state.token),
          newPassword: data.newPassword,
        });

        if ("data" in result) {
          setState((prev) => ({
            ...prev,
            message: "Password reset successful! Redirecting to login...",
          }));
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return { success: true };
        } else if ("error" in result) {
          setState((prev) => ({
            ...prev,
            error:
              "Password reset failed. The link may have expired. Please request a new reset link.",
          }));
          return { success: false };
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "An error occurred. Please try again.",
        }));
        return { success: false };
      }

      return { success: false };
    },
    [state.email, state.token, resetPasswordMutation, navigate]
  );

  return {
    ...state,
    submitResetPassword,
    clearMessages,
    isLoading: resetPasswordMutation.isLoading,
    isValidResetLink: Boolean(state.email && state.token),
  };
};
