export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordRequestData extends ForgotPasswordFormData {
  captchaToken: string;
  browserFingerprint: string;
  redirectBaseUrl?: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordModalProps {
  show: boolean;
  onHide: () => void;
}

export interface ForgotPasswordState {
  message: string;
  error: string;
}

export interface ResetPasswordState {
  message: string;
  error: string;
  email: string | null;
  token: string | null;
}