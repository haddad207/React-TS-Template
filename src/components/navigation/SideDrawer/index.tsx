import { useRef, useEffect } from "react";
import { Box, Divider, Drawer, IconButton, List } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/store.ts";
import { openDrawer, closeDrawer } from "../../../store/slices/uiSlice";
import { SideDrawerItem } from "./SideDrawerItem";
import type SideDrawerProps from "../../../models/navigation/SideDrawerProps.ts";

function SideDrawer({ links, onClose }: SideDrawerProps) {
  const dispatch = useAppDispatch();
  const { isDrawerOpen } = useAppSelector((state) => state.ui);
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const handleOpenDrawer = () => dispatch(openDrawer());
  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
    onClose?.();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseDrawer();
  };

  useEffect(() => {
    if (isDrawerOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isDrawerOpen]);

  return (
    <Box>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleOpenDrawer}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            boxShadow: "none",
          },
        }}
      >
        <Box
          ref={drawerRef}
          tabIndex={-1}
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleCloseDrawer}
          onKeyDown={handleCloseDrawer}
        >
          <List>
            {links.map((link, index) => (
              <Box key={index}>
                <SideDrawerItem link={link} onNavigate={handleNavigate} />
                {index < links.length - 1 && (
                  <Divider sx={{ backgroundColor: "white" }} />
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SideDrawer;
