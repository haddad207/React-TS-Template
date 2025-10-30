import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CheckIfAdmin } from "../../../utils/checkAdmin.ts";
import type SideDrawerItemProps from "../../../models/navigation/SideDrawerItemProps.ts";

export function SideDrawerItem({
  link,
  level = 0,
  onNavigate,
}: SideDrawerItemProps) {
  const [open, setOpen] = useState(false);
  const isAdmin = CheckIfAdmin();

  if (link.adminOnly && !isAdmin) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link.children && link.children.length > 0) {
      setOpen(!open);
    } else if (link.path) {
      onNavigate(link.path);
    }
  };

  return (
    <Box>
      <ListItem
        component="div"
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          pl: level * 2,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "rgba(127,167,213,0.76)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit", paddingLeft: 2 }}>
          {link.icon}
        </ListItemIcon>
        <ListItemText primary={link.name} />
        {link.children && link.children.length > 0 ? (
          open ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )
        ) : null}
      </ListItem>
      {link.children && link.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            {link.children.map((child, idx) => (
              <SideDrawerItem
                key={idx}
                link={child}
                level={level + 1}
                onNavigate={onNavigate}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
