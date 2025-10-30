import { useState, useCallback } from "react";
import { useForgotPasswordMutation } from "../api/authApi";
import type { ForgotPasswordFormData, ForgotPasswordState } from "../models/auth/AuthTypes";

export const useForgotPassword = () => {
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [state, setState] = useState<ForgotPasswordState>({
    message: "",
    error: "",
  });

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, message: "", error: "" }));
  }, []);

  const submitForgotPassword = useCallback(async (data: ForgotPasswordFormData) => {
    setState(prev => ({ ...prev, message: "", error: "" }));

    try {
      // Check client-side rate limiting

      const result = await forgotPasswordMutation({
        email: data.email,
        redirectBaseUrl: `${window.location.origin}/reset-password`
      });

      if ('data' in result) {
        setState(prev => ({
          ...prev,
          message: "If an account with that email exists, you will receive password reset instructions."
        }));
        return { success: true };
      } else if ('error' in result) {
        const errorData = result.error as any;

        // Handle specific CAPTCHA or risk-based errors
        if (errorData?.data?.requiresChallenge) {
          setState(prev => ({
            ...prev,
            error: "Additional verification required. Please try again or contact support."
          }));
        } else if (errorData?.status === 429) {
          setState(prev => ({
            ...prev,
            error: "Too many requests. Please wait before trying again."
          }));
        } else {
          setState(prev => ({ ...prev, error: "An error occurred. Please try again." }));
        }
        return { success: false };
      }
    } catch (error: any) {
      if (error.message?.includes('CAPTCHA')) {
        setState(prev => ({
          ...prev,
          error: "Security verification failed. Please refresh the page and try again."
        }));
      } else {
        setState(prev => ({ ...prev, error: "An error occurred. Please try again." }));
      }
      return { success: false };
    }

    return { success: false };
  }, [forgotPasswordMutation]);

  return {
    ...state,
    submitForgotPassword,
    clearMessages,
    isLoading: forgotPasswordMutation.isLoading,
  };
};