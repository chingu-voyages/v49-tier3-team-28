import { Modal } from "@mui/material";
import React from "react";

interface ContinueDraftModalProps {
  open: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
}

const ContinueDraftModal: React.FC<ContinueDraftModalProps> = ({
  open,
  onClose,
  onSaveDraft,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">
            Continue Where You Left Off?
          </h2>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={onSaveDraft}
            >
              Yes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContinueDraftModal;
