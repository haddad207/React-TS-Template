export default interface LoginResponse {
  // Normal login response (Token)
  userId?: string;
  fullName?: string;
  email?: string;
  expirationTime?: string;
  token?: string;
  refreshToken?: string;
  refreshTokenExpirationDateTime?: string;
  role?: string[];

  // Temporary password response
  mustChangePassword?: boolean;
  message?: string;
}
