import React, { useState } from "react";
import {
  Button,
  Menu,
  Fade,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useLogoutMutation } from "../../../api/authApi.ts";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../store/store.ts";
import { logoutUser } from "../../../store/slices/userSlice.ts";

export default function UserMenu() {
  const fullName = localStorage["FullName"];
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div>
        <Button onClick={handleClick} sx={{ color: "#ffffff" }}>
          {fullName}
        </Button>
      </div>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={async () => {
            try {
              await logout;
              dispatch(logoutUser());
              navigate("/login");
            } catch (error) {
              console.error("Logout failed");
            }
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
