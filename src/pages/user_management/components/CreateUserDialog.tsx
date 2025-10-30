import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { dialogStyles } from "../UserManagement.styles";
import GradientButton from "../../../components/ui/GradientButton";
import type CreateUserDialogProps from "../../../models/user_management/CreateUserDialogProps.ts";
import type CreateUserFormData from "../../../models/user_management/CreateUserFormData.ts";

export default function CreateUserDialog({
  open,
  formData,
  isCreating,
  onClose,
  onFormDataChange,
  onSubmit,
}: CreateUserDialogProps) {
  const handleInputChange =
    (field: keyof CreateUserFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFormDataChange({
        ...formData,
        [field]: event.target.value,
      });
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={dialogStyles}
    >
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
            fullWidth
            placeholder="user@example.com"
          />
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            required
            fullWidth
            placeholder="Enter password"
          />
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange("firstName")}
            fullWidth
            placeholder="John"
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={handleInputChange("lastName")}
            fullWidth
            placeholder="Doe"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>
        <GradientButton
          onClick={onSubmit}
          disabled={isCreating || !formData.email || !formData.password}
          gradientColors={["#10b981", "#059669"]}
          hoverGradientColors={["#059669", "#047857"]}
        >
          {isCreating ? "Creating..." : "Create User"}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}
