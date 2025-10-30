import { Outlet, useLocation } from "react-router";
import { AppBar, Box, LinearProgress, Toolbar } from "@mui/material";
import Container from "@mui/material/Container";
import { ToastContainer } from "react-toastify";
import { useState, useCallback, useEffect } from "react";

import useWindowDimensions from "../../../hooks/useWindowDimensions.ts";
import { useIdleAuthSession } from "../../../hooks/useIdleAuthSession.ts";
import { useAppSelector, useAppDispatch } from "../../../store/store.ts";
import { openDrawer, closeDrawer } from "../../../store/slices/uiSlice";
import SideDrawer from "../SideDrawer";
import AutoLogoutModal from "../../ui/AutoLogoutModal.tsx";
import { NavBarBrand } from "./NavBarBrand";
import { NavBarActions } from "./NavBarActions";
import { getNavigationLinks } from "../navigationConfig.tsx";
import { useMediaQuery, useTheme } from "@mui/material";

export default function NavBar() {
  const { width } = useWindowDimensions();
  const { isLoading, isDrawerOpen } = useAppSelector((state) => state.ui);
  const location = useLocation();
  const { isLoggedIn } = useIdleAuthSession();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMobilePhone = useMediaQuery("(max-width: 480px)"); // For smartphones only, not tablets
  const navigationLinks = getNavigationLinks(isMobilePhone);
  const [addPersonnelHandler, setAddPersonnelHandler] = useState<
    (() => void) | null
  >(null);
  const [searchPersonnelHandler, setSearchPersonnelHandler] = useState<
    (() => void) | null
  >(null);

  const isLoginPage = location.pathname === "/login";

  // Listen for personnel handlers registration from personnel page
  useEffect(() => {
    const handleRegisterAddPersonnel = (event: any) => {
      setAddPersonnelHandler(() => event.detail.handler);
    };

    const handleRegisterSearchPersonnel = (event: any) => {
      setSearchPersonnelHandler(() => event.detail.handler);
    };

    const handleUnregisterAddPersonnel = () => {
      setAddPersonnelHandler(null);
    };

    const handleUnregisterSearchPersonnel = () => {
      setSearchPersonnelHandler(null);
    };

    window.addEventListener("registerAddPersonnel", handleRegisterAddPersonnel);
    window.addEventListener(
      "registerSearchPersonnel",
      handleRegisterSearchPersonnel
    );
    window.addEventListener(
      "unregisterAddPersonnel",
      handleUnregisterAddPersonnel
    );
    window.addEventListener(
      "unregisterSearchPersonnel",
      handleUnregisterSearchPersonnel
    );

    return () => {
      window.removeEventListener(
        "registerAddPersonnel",
        handleRegisterAddPersonnel
      );
      window.removeEventListener(
        "registerSearchPersonnel",
        handleRegisterSearchPersonnel
      );
      window.removeEventListener(
        "unregisterAddPersonnel",
        handleUnregisterAddPersonnel
      );
      window.removeEventListener(
        "unregisterSearchPersonnel",
        handleUnregisterSearchPersonnel
      );
    };
  }, []);

  const handleOpenDrawer = () => {
    dispatch(openDrawer());
  };

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  const handleAddPersonnel = () => {
    if (addPersonnelHandler) {
      addPersonnelHandler();
    }
  };

  const handleSearchPersonnel = () => {
    if (searchPersonnelHandler) {
      searchPersonnelHandler();
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "rgba(0,0,0,.6)" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              {!isLoginPage && !isMobile && (
                <Box sx={{ mr: 2, ml: -10 }}>
                  <SideDrawer
                    links={navigationLinks}
                    onClose={handleCloseDrawer}
                  />
                </Box>
              )}

              {!isMobile && <NavBarBrand variant="desktop" />}
            </Box>

            {!isMobile && (
              <NavBarActions
                isLoggedIn={isLoggedIn}
                isLoginPage={isLoginPage}
                onOpenDrawer={handleOpenDrawer}
                onAddPersonnel={
                  addPersonnelHandler ? handleAddPersonnel : undefined
                }
                onSearchPersonnel={
                  searchPersonnelHandler ? handleSearchPersonnel : undefined
                }
              />
            )}

            {isMobile && (
              <>
                <NavBarActions
                  isLoggedIn={isLoggedIn}
                  isLoginPage={isLoginPage}
                  onOpenDrawer={handleOpenDrawer}
                  onAddPersonnel={
                    addPersonnelHandler ? handleAddPersonnel : undefined
                  }
                  onSearchPersonnel={
                    searchPersonnelHandler ? handleSearchPersonnel : undefined
                  }
                />

                <NavBarBrand variant="mobile" />

                {!isLoginPage && (
                  <Box sx={{ display: "none" }}>
                    <SideDrawer
                      links={navigationLinks}
                      onClose={handleCloseDrawer}
                    />
                  </Box>
                )}
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      <AutoLogoutModal />
      <ToastContainer />
      <Outlet />
    </>
  );
}
