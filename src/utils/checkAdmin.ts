import type User from "../models/user_management/User.ts";

/**
 * Get user roles from localStorage
 */
const getUserRoles = (): string[] => {
  try {
    const storedRoles = localStorage.getItem("Roles");
    return JSON.parse(storedRoles || "[]");
  } catch (error) {
    console.error("Error parsing roles from localStorage:", error);
    return [];
  }
};

/**
 * Check if current logged-in user is an Admin (includes SuperAdmin)
 */
export const CheckIfAdmin = (): boolean => {
  try {
    const userRoles = getUserRoles();
    const roleLowerCase = userRoles.map((role) => role.toLowerCase());
    return (
      roleLowerCase.includes("admin") || roleLowerCase.includes("superadmin")
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Check if current logged-in user is a SuperAdmin
 */
export const CheckIfSuperAdmin = (): boolean => {
  try {
    const userRoles = getUserRoles();
    const roleLowerCase = userRoles.map((role) => role.toLowerCase());
    return roleLowerCase.includes("superadmin");
  } catch (error) {
    console.error("Error checking SuperAdmin status:", error);
    return false;
  }
};

/**
 * Check if a specific user object has Admin role
 */
export const isUserAdmin = (user: User): boolean => {
  return user.roles.some((role) => role.toLowerCase() === "admin");
};

/**
 * Check if a specific user object has SuperAdmin role
 */
export const isUserSuperAdmin = (user: User): boolean => {
  return user.roles.some((role) => role.toLowerCase() === "superadmin");
};

/**
 * Check if a specific user object is a regular user (not admin or superadmin)
 */
export const isUserRegular = (user: User): boolean => {
  return !isUserAdmin(user) && !isUserSuperAdmin(user);
};

/**
 * Check if a specific user object is locked
 */
export const isUserLocked = (user: User): boolean => {
  return !user.isActive;
};

/**
 * Get current user email from localStorage
 */
const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem("Email");
};

/**
 * Check if current logged-in user is the seeded admin
 */
export const CheckIfSeededAdmin = (): boolean => {
  try {
    const userEmail = getCurrentUserEmail();

    if (!userEmail) {
      return false;
    }

    // Must be an admin first
    if (!CheckIfAdmin()) {
      return false;
    }

    // Configure this email to match your seeded admin configuration
    const SEEDED_ADMIN_EMAIL = "devteam@gov2x.com";
    const emailLower = userEmail.toLowerCase();

    return emailLower === SEEDED_ADMIN_EMAIL.toLowerCase();
  } catch (error) {
    console.error("Error checking seeded admin status:", error);
    return false;
  }
};
