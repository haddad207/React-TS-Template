import type NavigationLink from "./NavigationLink";

export default interface SideDrawerProps {
  links: NavigationLink[];
  onClose?: () => void;
}
