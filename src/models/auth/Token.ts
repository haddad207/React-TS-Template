export default interface Token {
  userId: string;
  fullName: string;
  email: string;
  expirationTime: string;
  token: string;
  refreshToken: string;
  refreshTokenExpirationDateTime: string;
  role: string[];
}
