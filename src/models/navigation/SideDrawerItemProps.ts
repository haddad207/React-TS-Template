import type NavigationLink from "./NavigationLink.ts";

export default interface SideDrawerItemProps {
  link: NavigationLink;
  level?: number;
  onNavigate: (path: string) => void;
}
