import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SecurityIcon from "@mui/icons-material/Security";
import { CheckIfSeededAdmin } from "../../utils/checkAdmin";
import type NavigationLink from "../../models/navigation/NavigationLink";



export const getNavigationLinks = (
  isMobilePhone: boolean = false
): NavigationLink[] => {
  const isSeededAdmin = CheckIfSeededAdmin();

  const adminControlsChildren = [
    {
      name: "Manage Users",
      path: "/manage-users",
      icon: <PeopleIcon />,
    },
  ];

  if (isSeededAdmin) {
    adminControlsChildren.push({
      name: "ALAMO Protocol",
      path: "/alamo",
      icon: <SecurityIcon />,
    });
  }

  const allLinks = [
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon />,
    },
    {
      name: "Admin Controls",
      icon: <AdminPanelSettingsIcon />,
      adminOnly: true,
      children: adminControlsChildren,
    },
  ];

  // Filter out specific links for mobile phones (max-width: 480px)
  if (isMobilePhone) {
    const filteredLinks = allLinks.filter(
      (link) => !["Admin Controls"].includes(link.name)
    );

    // Add ALAMO Protocol as separate top-level link for seeded admins on mobile
    if (isSeededAdmin) {
      filteredLinks.push({
        name: "ALAMO Protocol",
        path: "/alamo",
        icon: <SecurityIcon />,
      });
    }

    return filteredLinks;
  }

  return allLinks;
};

export const NAVIGATION_LINKS: NavigationLink[] = getNavigationLinks();

export const APP_CONFIG = {
  title: "Template",
  mobileTitle: "Template",
  logoHeight: 47,
  drawerWidth: 240,
} as const;
