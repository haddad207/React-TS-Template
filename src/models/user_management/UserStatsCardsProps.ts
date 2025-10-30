import type User from "./User.ts";

export default interface UserStatsCardsProps {
  users: User[];
  isMobile?: boolean;
}
