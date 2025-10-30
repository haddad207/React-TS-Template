export default interface User {
  id: string;
  email: string;
  fullName?: string;
  roles: string[];
  isActive: boolean;
}
