import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function CustomDialog(
  open: boolean,
  title: string,
  content: string,
  onConfirm: () => void
) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Yes</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => (open = false)}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
