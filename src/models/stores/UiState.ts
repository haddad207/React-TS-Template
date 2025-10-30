export default interface UiState {
  isLoading: boolean;
  autoLogout: boolean;
  progress: number;
  invalidRefreshToken: boolean;
  isDrawerOpen: boolean;
  showLogoutNotification: boolean;
}
