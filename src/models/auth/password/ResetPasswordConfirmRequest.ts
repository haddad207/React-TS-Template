export default interface ResetPasswordConfirmRequest {
  email: string;
  token: string;
  newPassword: string;
}
