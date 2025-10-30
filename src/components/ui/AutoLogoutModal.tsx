import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import {
  setAutoLogout,
  setProgress,
  updateProgress,
  setLogoutNotification,
} from "../../store/slices/uiSlice.ts";
import { useIdleAuthSession } from "../../hooks/useIdleAuthSession.ts";

export default function AutoLogoutModal() {
  const { autoLogout, progress, showLogoutNotification } = useAppSelector((state) => state.ui);
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { stayLoggedIn, handleLogout } = useIdleAuthSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (autoLogout && !isLoggedIn) {
      dispatch(setAutoLogout());
      dispatch(setProgress());
      dispatch(setLogoutNotification(true));
      return;
    }

    if (autoLogout && isLoggedIn) {
      // Progress is now handled by the idle timer's promptBeforeIdle
      // Just update progress every 300ms to show countdown
      const timer = setInterval(() => {
        if (progress <= 100) {
          if (progress >= 100) {
            // Let the idle timer handle the actual logout
            handleLogout();
          } else {
            dispatch(updateProgress());
          }
        }
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [dispatch, handleLogout, progress, autoLogout, isLoggedIn]);
  return (
    <>
      <Dialog open={autoLogout && isLoggedIn}>
        <DialogTitle>You are about to be automatically signed-out!</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Do you wish to remain logged-in?
          </DialogContentText>
          <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={stayLoggedIn}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
          >
            Sign-Out
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showLogoutNotification}
        autoHideDuration={6000}
        onClose={() => dispatch(setLogoutNotification(false))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatch(setLogoutNotification(false))}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Your session has expired and you have been automatically logged out.
        </Alert>
      </Snackbar>
    </>
  );
}
