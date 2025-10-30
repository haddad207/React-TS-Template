export default interface NavBarActionsProps {
  isLoggedIn: boolean;
  isLoginPage: boolean;
  onOpenDrawer: () => void;
  onAddPersonnel?: () => void;
  onSearchPersonnel?: () => void;
}
