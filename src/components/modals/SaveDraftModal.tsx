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
      <div className="bg-white fixed inset-0 flex items-center justify-center bg-opacity-70">
        <div className="m-4 mt-20 mb-40 pt-8 pb-8 bg-white rounded-3xl w-full max-w-md shadow-lg text-center relative h-fill-available">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 scale-150"
          >
            <FiX />
          </button>
          <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
          <p className="text-lg mb-8">
            You have unsaved exercise data. Do you want to save it before
            leaving?
          </p>
          <div className="flex justify-between flex-col items-center h-28">
            <BasicRoundedButton
              onClick={onSaveDraft}
              label="Save and Exit"
              buttonClassNames="defaultButtonColor"
            />

            <Link href="/user/home">
              <BasicRoundedButton
                onClick={() => {
                  if (localStorage.getItem("draft")) {
                    localStorage.removeItem("draft");
                  }
                }}
                label="Leave Without Saving"
                buttonClassNames="secondaryButtonColor"
              />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveDraftModal;
