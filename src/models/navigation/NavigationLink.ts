export default interface NavigationLink {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavigationLink[];
  adminOnly?: boolean;
}
