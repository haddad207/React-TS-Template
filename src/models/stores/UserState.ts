export default interface UserState {
  fullName: string;
  email: string;
  expirationTime: string;
  token: string;
  refreshToken: string;
  refreshTokenExpirationTime: string;
  role: string[];
  isLoggedIn: boolean;
  resetPasswordUserEmail: string;
}
