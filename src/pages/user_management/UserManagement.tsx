// React imports
import { useState, useEffect } from "react";

// Material-UI components
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

// Material-UI icons
import {
  PersonAdd,
  Edit,
  Delete,
  Lock,
  LockOpen,
  AdminPanelSettings,
  Person,
  SupervisorAccount,
} from "@mui/icons-material";

// Third-party libraries
import { toast } from "react-toastify";

// Utilities and types
import {
  CheckIfSuperAdmin,
  isUserAdmin,
  isUserSuperAdmin,
  isUserRegular,
  isUserLocked,
} from "../../utils/checkAdmin";

// Admin API hooks
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  usePromoteUserMutation,
  usePromoteToAdminMutation as useAdminPromoteToAdminMutation,
  usePromoteToSuperAdminMutation as useAdminPromoteToSuperAdminMutation,
  useDemoteUserMutation,
  useDemoteAdminMutation as useAdminDemoteAdminMutation,
  useDemoteSuperAdminMutation as useAdminDemoteSuperAdminMutation,
  useSetUserLockMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
} from "../../api/adminApi";

// SuperAdmin API hooks
import {
  useGetAllUsersAsSuperQuery,
  useCreateUserAsSuperMutation,
  usePromoteUserToAdminMutation,
  usePromoteUserToSuperAdminMutation,
  useDemoteAdminMutation as useSuperDemoteAdminMutation,
  useDemoteSuperAdminMutation as useSuperDemoteSuperAdminMutation,
  useSetUserLockAsSuperMutation,
  useDeleteUserAsSuperMutation,
  useResetUserPasswordAsSuperMutation,
} from "../../api/superAdminApi";
import type CreateUserFormData from "../../models/user_management/CreateUserFormData.ts";
import type User from "../../models/user_management/User.ts";

export default function UserManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [createFormData, setCreateFormData] = useState<CreateUserFormData>({
    email: "",
    firstName: "",
    lastName: "",
  });

  // Check if current user is SuperAdmin (stabilized to prevent re-renders)
  const [isCurrentUserSuperAdmin, setIsCurrentUserSuperAdmin] =
    useState<boolean>(false);

  useEffect(() => {
    setIsCurrentUserSuperAdmin(CheckIfSuperAdmin());
  }, []); // Empty dependency array - only run once on mount

  // Conditional API usage based on user role
  const {
    data: adminUsers,
    isLoading: adminLoading,
    error: adminError,
    refetch: adminRefetch,
  } = useGetAllUsersQuery(undefined, {
    skip: isCurrentUserSuperAdmin,
  });
  const {
    data: superUsers,
    isLoading: superLoading,
    error: superError,
    refetch: superRefetch,
  } = useGetAllUsersAsSuperQuery(undefined, {
    skip: !isCurrentUserSuperAdmin,
  });

  // Use the appropriate data based on role
  const users = isCurrentUserSuperAdmin ? superUsers : adminUsers;
  const isLoading = isCurrentUserSuperAdmin ? superLoading : adminLoading;
  const error = isCurrentUserSuperAdmin ? superError : adminError;
  const refetch = isCurrentUserSuperAdmin ? superRefetch : adminRefetch;

  // Conditional mutations based on user role
  const [createUserAdmin, { isLoading: isCreatingAdmin }] =
    useCreateUserMutation();
  const [createUserSuper, { isLoading: isCreatingSuper }] =
    useCreateUserAsSuperMutation();
  const [promoteUser] = usePromoteUserMutation();
  const [promoteToAdminAdmin] = useAdminPromoteToAdminMutation();
  const [promoteToAdminSuper] = usePromoteUserToAdminMutation();
  const [promoteToSuperAdminAdmin] = useAdminPromoteToSuperAdminMutation();
  const [promoteToSuperAdminSuper] = usePromoteUserToSuperAdminMutation();
  const [demoteUser] = useDemoteUserMutation();
  const [demoteAdminAdmin] = useAdminDemoteAdminMutation();
  const [demoteAdminSuper] = useSuperDemoteAdminMutation();
  const [demoteSuperAdminAdmin] = useAdminDemoteSuperAdminMutation();
  const [demoteSuperAdminSuper] = useSuperDemoteSuperAdminMutation();
  const [setUserLockAdmin] = useSetUserLockMutation();
  const [setUserLockSuper] = useSetUserLockAsSuperMutation();
  const [deleteUserAdmin] = useDeleteUserMutation();
  const [deleteUserSuper] = useDeleteUserAsSuperMutation();
  const [resetUserPasswordAdmin] = useResetUserPasswordMutation();
  const [resetUserPasswordSuper] = useResetUserPasswordAsSuperMutation();

  // Helper functions to use appropriate mutations
  const createUser = isCurrentUserSuperAdmin
    ? createUserSuper
    : createUserAdmin;
  const isCreating = isCurrentUserSuperAdmin
    ? isCreatingSuper
    : isCreatingAdmin;
  const promoteToAdmin = isCurrentUserSuperAdmin
    ? promoteToAdminSuper
    : promoteToAdminAdmin;
  const promoteToSuperAdmin = isCurrentUserSuperAdmin
    ? promoteToSuperAdminSuper
    : promoteToSuperAdminAdmin;
  const demoteAdmin = isCurrentUserSuperAdmin
    ? demoteAdminSuper
    : demoteAdminAdmin;
  const demoteSuperAdmin = isCurrentUserSuperAdmin
    ? demoteSuperAdminSuper
    : demoteSuperAdminAdmin;
  const setUserLock = isCurrentUserSuperAdmin
    ? setUserLockSuper
    : setUserLockAdmin;
  const deleteUser = isCurrentUserSuperAdmin
    ? deleteUserSuper
    : deleteUserAdmin;
  const resetUserPassword = isCurrentUserSuperAdmin
    ? resetUserPasswordSuper
    : resetUserPasswordAdmin;

  const handleCreateUser = async () => {
    try {
      // Transform data to match backend DTO format
      const userData = {
        email: createFormData.email,
        password: "TempPassword123!", // Temporary password - backend will generate and replace
        firstName: createFormData.firstName || "",
        lastName: createFormData.lastName || "",
      };

      await createUser(userData).unwrap();
      toast.success("User created successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      setOpenCreateDialog(false);
      setCreateFormData({ email: "", firstName: "", lastName: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handlePromoteUser = async (userId: string, userEmail: string) => {
    try {
      await promoteUser(userId).unwrap();
      toast.success(`User ${userEmail} promoted to Admin`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to promote user", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handlePromoteToAdmin = async (userId: string, userEmail: string) => {
    try {
      await promoteToAdmin(userId).unwrap();
      toast.success(`User ${userEmail} promoted to Admin`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to promote user to Admin", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handlePromoteToSuperAdmin = async (
    userId: string,
    userEmail: string
  ) => {
    try {
      await promoteToSuperAdmin(userId).unwrap();
      toast.success(`User ${userEmail} promoted to SuperAdmin`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to promote user to SuperAdmin",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    }
  };

  const handleDemoteUser = async (userId: string, userEmail: string) => {
    try {
      await demoteUser(userId).unwrap();
      toast.success(`User ${userEmail} demoted from Admin`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to demote user", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handleDemoteAdmin = async (userId: string, userEmail: string) => {
    try {
      await demoteAdmin(userId).unwrap();
      toast.success(`Admin ${userEmail} demoted to User`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to demote admin", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handleDemoteSuperAdmin = async (userId: string, userEmail: string) => {
    try {
      await demoteSuperAdmin(userId).unwrap();
      toast.success(`SuperAdmin ${userEmail} demoted to Admin`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to demote SuperAdmin", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const handleToggleUserLock = async (
    userId: string,
    userEmail: string,
    currentlyLocked: boolean
  ) => {
    try {
      await setUserLock({ userId, isUnlocked: currentlyLocked }).unwrap();
      toast.success(
        `User ${userEmail} ${currentlyLocked ? "unlocked" : "locked"}`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${currentlyLocked ? "unlock" : "lock"} user`,
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success(`User ${selectedUser.email} deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
      });
      setOpenDeleteDialog(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  const openDeleteConfirmation = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      await resetUserPassword({
        userId: selectedUser.id,
        data: { newPassword },
      }).unwrap();
      toast.success(`Password reset for ${selectedUser.email}`, {
        position: "top-center",
        autoClose: 3000,
      });
      setOpenResetPasswordDialog(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  // Role check functions are now imported from utils/checkAdmin

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <CircularProgress
          sx={{ color: "#3b82f6", position: "relative", zIndex: 1 }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", p: 3, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Alert
          severity="error"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            position: "relative",
            zIndex: 1,
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            "& .MuiAlert-message": { color: "#fff" },
          }}
        >
          Failed to load users. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: isMobile ? 2 : 3,
        position: "relative",
      }}
    >
      {/* Background overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.4)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <AdminPanelSettings
          sx={{
            fontSize: isMobile ? 48 : 64,
            color: "#3b82f6",
            mb: 2,
          }}
        />
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            color: "#fff",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          User Management
        </Typography>
      </Box>

      {/* Main Content Card */}
      <Card
        sx={{
          maxWidth: 1200,
          mx: "auto",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Actions Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Users ({users?.length || 0})
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setOpenCreateDialog(true)}
                sx={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                  },
                }}
              >
                Create User
              </Button>
            </Stack>
          </Box>

          {/* Users Table */}
          <TableContainer
            sx={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: 2,
              maxHeight: isMobile ? 400 : 600,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </TableCell>
                  {!isMobile && (
                    <TableCell
                      sx={{
                        background: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Full Name
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Roles
                  </TableCell>
                  <TableCell
                    sx={{
                      background: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "#fff" }}>{user.email}</TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {user.fullName || "-"}
                      </TableCell>
                    )}
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {user.roles.map((role) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            sx={{
                              background:
                                role === "SuperAdmin"
                                  ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                                  : role === "Admin"
                                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                  : "linear-gradient(135deg, #10b981, #059669)",
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        flexWrap="wrap"
                      >
                        {/* Regular User Actions - promote to Admin (only SuperAdmins can do this) */}
                        {isUserRegular(user) && isCurrentUserSuperAdmin && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handlePromoteToAdmin(user.id, user.email)
                            }
                            sx={{ color: "#22c55e" }}
                            title="Promote to Admin"
                          >
                            <AdminPanelSettings />
                          </IconButton>
                        )}

                        {/* Admin Actions - only SuperAdmins can promote to SuperAdmin or demote Admins */}
                        {isUserAdmin(user) &&
                          !isUserSuperAdmin(user) &&
                          isCurrentUserSuperAdmin && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handlePromoteToSuperAdmin(user.id, user.email)
                                }
                                sx={{ color: "#8b5cf6" }}
                                title="Promote to SuperAdmin"
                              >
                                <SupervisorAccount />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDemoteAdmin(user.id, user.email)
                                }
                                sx={{ color: "#f59e0b" }}
                                title="Demote to User"
                              >
                                <Person />
                              </IconButton>
                            </>
                          )}

                        {/* SuperAdmin Actions - only SuperAdmins can demote other SuperAdmins */}
                        {isUserSuperAdmin(user) && isCurrentUserSuperAdmin && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDemoteSuperAdmin(user.id, user.email)
                            }
                            sx={{ color: "#f59e0b" }}
                            title="Demote to Admin"
                          >
                            <AdminPanelSettings />
                          </IconButton>
                        )}

                        {/* Show restricted message for regular admins viewing admin/superadmin users */}
                        {!isCurrentUserSuperAdmin &&
                          (isUserAdmin(user) || isUserSuperAdmin(user)) && (
                            <Chip
                              label="Restricted"
                              size="small"
                              sx={{
                                background: "rgba(156, 163, 175, 0.2)",
                                color: "rgba(156, 163, 175, 0.8)",
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        {/* Lock/Unlock - restricted for regular admins on admin/superadmin users */}
                        {(isCurrentUserSuperAdmin || isUserRegular(user)) && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleToggleUserLock(
                                user.id,
                                user.email,
                                isUserLocked(user)
                              )
                            }
                            sx={{
                              color: isUserLocked(user) ? "#22c55e" : "#f59e0b",
                            }}
                            title={
                              isUserLocked(user) ? "Unlock User" : "Lock User"
                            }
                          >
                            {isUserLocked(user) ? <LockOpen /> : <Lock />}
                          </IconButton>
                        )}

                        {/* Reset Password - restricted for regular admins on admin/superadmin users */}
                        {(isCurrentUserSuperAdmin || isUserRegular(user)) && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenResetPasswordDialog(true);
                            }}
                            sx={{ color: "#3b82f6" }}
                            title="Reset Password"
                          >
                            <Edit />
                          </IconButton>
                        )}

                        {/* Delete - restricted for regular admins on admin/superadmin users */}
                        {(isCurrentUserSuperAdmin || isUserRegular(user)) && (
                          <IconButton
                            size="small"
                            onClick={() => openDeleteConfirmation(user)}
                            sx={{ color: "#ef4444" }}
                            title="Delete User"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* Create User Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          Create New User
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Email Address *"
              type="email"
              fullWidth
              value={createFormData.email}
              onChange={(e) =>
                setCreateFormData({ ...createFormData, email: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                },
              }}
            />
            <TextField
              label="First Name"
              fullWidth
              value={createFormData.firstName}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  firstName: e.target.value,
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                },
              }}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={createFormData.lastName}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  lastName: e.target.value,
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={!createFormData.email || isCreating}
            sx={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
              },
              "&:disabled": { background: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            {isCreating ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={openResetPasswordDialog}
        onClose={() => setOpenResetPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          Reset Password
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
          >
            Reset password for: <strong>{selectedUser?.email}</strong>
          </Typography>
          <TextField
            label="New Password *"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": { color: "#3b82f6" },
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <Button
            onClick={() => setOpenResetPasswordDialog(false)}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            disabled={!newPassword}
            sx={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
              },
              "&:disabled": { background: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#ff6b6b",
            borderBottom: "1px solid rgba(255, 107, 107, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Delete sx={{ color: "#ff6b6b" }} />
          Confirm Delete User
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              background: "rgba(255, 107, 107, 0.1)",
              border: "1px solid rgba(255, 107, 107, 0.2)",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}
            >
              ⚠️ This action cannot be undone
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              You are about to permanently delete this user account and all
              associated data.
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ color: "#fff", mb: 1 }}>
            Are you sure you want to delete the following user?
          </Typography>

          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Email Address:
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}
            >
              {selectedUser?.email}
            </Typography>

            {selectedUser?.fullName && (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Full Name:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}
                >
                  {selectedUser.fullName}
                </Typography>
              </>
            )}

            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Roles:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
              {selectedUser?.roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  sx={{
                    background:
                      role === "SuperAdmin"
                        ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                        : role === "Admin"
                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                        : "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: "1px solid rgba(255, 107, 107, 0.2)" }}
        >
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setSelectedUser(null);
            }}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              },
              fontWeight: "bold",
            }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
