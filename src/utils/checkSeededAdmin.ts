export const CheckIfSeededAdmin = (): boolean => {
  try {
    const userEmail = localStorage.getItem("Email");

    if (!userEmail) {
      return false;
    }

    const storedRoles = localStorage.getItem("Roles");
    let userRoles: string[] = [];

    try {
      userRoles = JSON.parse(storedRoles || "[]");
    } catch (error) {
      console.error("Error parsing roles from localStorage:", error);
      return false;
    }

    const roleLowerCase = userRoles.map((role) => role.toLowerCase());
    const isAdmin = roleLowerCase.includes("admin") || roleLowerCase.includes("superadmin");

    if (!isAdmin) {
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

export const checkSeededAdminAsync = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("Token");
    if (!token) {
      return false;
    }

    return false;
  } catch (error) {
    console.error("Error verifying seeded admin status:", error);
    return false;
  }
};