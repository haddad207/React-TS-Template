export default interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  roles: string[];
  createdAt?: string;
  lastLoginAt?: string;
}
