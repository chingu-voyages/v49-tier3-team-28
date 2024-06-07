import { Box, Button, Modal, Typography } from "@mui/material";

const SaveDraftModal = ({ open, onClose, onSaveDraft }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Save as Draft?
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Do you want to save your current log as a draft before exiting?
        </Typography>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={onSaveDraft}>
            Yes
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SaveDraftModal;
