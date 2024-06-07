import { Modal } from "@mui/material";
import Link from "next/link";
import React from "react";

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
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Save as Draft?</h2>
          <p className="text-lg mb-8">
            Do you want to save your current log as a draft before exiting?
          </p>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={onSaveDraft}
            >
              Yes
            </button>
            <Link href="/user/home" passHref>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={onClose}
              >
                No
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveDraftModal;
