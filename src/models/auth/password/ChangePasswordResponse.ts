import type Token from "../Token";

export default interface ChangePasswordResponse {
  message: string;
  auth: Token;
}