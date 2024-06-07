import { Modal } from "@mui/material";

interface SaveDraftModalProps {
  open: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
}

const SaveDraftModal: React.FC<SaveDraftModalProps> = ({
  open,
  onClose,
  onSaveDraft,
}) => {
  return (
    <Modal open={open} onClose={onClose} className="min-w-screen">
      <div className="bg-white w-1/2 flex flex-col items-center">
        <h2>Save as Draft?</h2>
        <h2>Do you want to save your current log as a draft before exiting?</h2>
        <button onClick={onSaveDraft}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </Modal>
  );
};

export default SaveDraftModal;
