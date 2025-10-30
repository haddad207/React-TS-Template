export default interface UserResponse {
  id: string;
  email: string;
  fullName?: string;
  roles: string[];
  isActive: boolean;
}
