import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  content,
  confirmText = "Yes",
  cancelText = "No",
  confirmColor = "primary",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} disabled={loading} color={confirmColor}>
          {loading ? "Please wait..." : confirmText}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}