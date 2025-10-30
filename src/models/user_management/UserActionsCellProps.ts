import type User from "./User.ts";

export default interface UserActionsCellProps {
  user: User;
  onPromote: (user: User) => void;
  onDemote: (user: User) => void;
  onToggleLock: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  isMobile?: boolean;
}
