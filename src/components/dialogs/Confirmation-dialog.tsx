import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  actionButtons: JSX.Element[];
  title: string;
  message?: string;
}

export default function ConfirmationDialog({
  open,
  onClose,
  title,
  message,
  actionButtons,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>{...actionButtons}</DialogActions>
    </Dialog>
  );
}
