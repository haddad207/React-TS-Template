import { createBrowserRouter, useLocation, Navigate } from "react-router";
import type { JSX } from "react";
import Homepage from "../pages/home/Homepage.tsx";
import NavBar from "../components/navigation/NavBar";

import Login from "../pages/auth/Login.tsx";
import Register from "../pages/auth/Register.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import ChangeInitialPassword from "../pages/auth/ChangeInitialPassword.tsx";
import UserManagement from "../pages/user_management/UserManagement.tsx";
import Alamo from "../pages/Alamo/Alamo.tsx";
import { CheckIfAdmin, CheckIfSeededAdmin } from "../utils/checkAdmin.ts";

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isLoggedIn = localStorage["IsLoggedIn"] === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isLoggedIn = localStorage["IsLoggedIn"] === "true";
  const isAdmin = CheckIfAdmin();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RequireSeededAdmin({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isLoggedIn = localStorage["IsLoggedIn"] === "true";
  const isSeededAdmin = CheckIfSeededAdmin();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSeededAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Homepage />
          </RequireAuth>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/change-initial-password", element: <ChangeInitialPassword /> },
      {
        path: "/register",
        element: (
          <RequireAdmin>
            <Register />
          </RequireAdmin>
        ),
      },
      {
        path: "/manage-users",
        element: (
          <RequireAdmin>
            <UserManagement />
          </RequireAdmin>
        ),
      },
      {
        path: "/alamo",
        element: (
          <RequireSeededAdmin>
            <Alamo />
          </RequireSeededAdmin>
        ),
      },
    ],
  },
  // {
  //   path: "/admin",
  //   element: <AdminNavBar />,
  //   children: []
  // }
]);

export default router;
