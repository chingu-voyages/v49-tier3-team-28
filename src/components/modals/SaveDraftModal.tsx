import { Modal } from "@mui/material";
import Link from "next/link";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

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
        <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg text-center relative">
          <button onClick={onClose} className="absolute top-2 right-2">
            <FiX />
          </button>
          <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
          <p className="text-lg mb-8">
            You have unsaved exercise data. Do you want to save it before
            leaving?
          </p>
          <div className="flex justify-between flex-col items-center h-28">
            <BasicRoundedButton onClick={onSaveDraft} label="Save and Exit">
              Save and Exit
            </BasicRoundedButton>
            <Link href="/user/home">
              <BasicRoundedButton
                onClick={() => {
                  if (localStorage.getItem("draft")) {
                    localStorage.removeItem("draft");
                  }
                }}
                label="Leave Without Saving"
              >
                Leave Without Saving
              </BasicRoundedButton>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveDraftModal;
