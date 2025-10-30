import { useEffect, useRef } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../api/authApi";
import { logoutUser } from "../store/slices/userSlice";
import {
  setAutoLogout,
  setProgress,
  setLogoutNotification,
} from "../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const PROMPT_TIMEOUT = 30 * 1000; // 30 seconds warning before logout

export const useIdleAuthSession = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { autoLogout } = useAppSelector((state) => state.ui);
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const lastStayLoggedInTime = useRef<number>(0);

  const onIdle = () => {
    console.log("User is idle - showing auto logout modal");
    if (isLoggedIn && !autoLogout) {
      dispatch(setProgress());
      dispatch(setAutoLogout());
    }
  };

  const onActive = () => {
    console.log("User is active - resetting idle timer");
    if (autoLogout) {
      dispatch(setAutoLogout());
      dispatch(setProgress());
    }
  };

  const onPrompt = () => {
    console.log("Prompting user - showing auto logout modal");
    if (isLoggedIn && !autoLogout) {
      dispatch(setProgress());
      dispatch(setAutoLogout());
    }
  };

  const { reset, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout: IDLE_TIMEOUT,
    promptBeforeIdle: PROMPT_TIMEOUT,
    throttle: 500,
    events: [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ],
    immediateEvents: [],
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: true,
  });

  // Handle token expiration checking (fallback for cases where tokens expire due to server-side issues)
  useEffect(() => {
    if (autoLogout || !isLoggedIn) return;

    const checkTokenExpiration = () => {
      const refreshExpireTimeString = localStorage.getItem(
        "RefreshTokenExpirationTime"
      );
      const tokenExpireTimeString = localStorage.getItem("TokenExpirationTime");

      const refreshExpireTime = refreshExpireTimeString
        ? new Date(refreshExpireTimeString).getTime()
        : 0;
      const tokenExpireTime = tokenExpireTimeString
        ? new Date(tokenExpireTimeString).getTime()
        : 0;

      const now = Date.now();

      // If refresh token expired, immediate logout
      if (refreshExpireTime < now && refreshExpireTime !== 0) {
        console.log("Refresh token expired - logging out immediately");
        handleLogout();
        return;
      }

      // If access token expired, trigger the modal (though idle timer should handle this)
      // But only if user hasn't recently chosen to stay logged in
      if (tokenExpireTime < now && tokenExpireTime !== 0) {
        const timeSinceLastStayLoggedIn = now - lastStayLoggedInTime.current;
        if (timeSinceLastStayLoggedIn > 300000) {
          // 5 minute grace period after staying logged in
          console.log("Access token expired - showing modal as fallback");
          if (!autoLogout) {
            dispatch(setProgress());
            dispatch(setAutoLogout());
          }
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [dispatch, autoLogout, isLoggedIn]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutUser());
      dispatch(setLogoutNotification(true));
      if (autoLogout) {
        dispatch(setAutoLogout());
        dispatch(setProgress());
      }
      navigate("/login");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  const stayLoggedIn = () => {
    console.log("User chose to stay logged in - resetting timer");
    lastStayLoggedInTime.current = Date.now();
    dispatch(setAutoLogout());
    dispatch(setProgress());
    reset();
    activate();
  };

  return {
    isLoggedIn: localStorage.getItem("IsLoggedIn") === "true",
    reset,
    activate,
    stayLoggedIn,
    handleLogout,
  };
};
