import { Modal } from "@mui/material";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface ContinueDraftModalProps {
  open: boolean;
  onClose: () => void;
  onContinueDraft: () => void;
}

const ContinueDraftModal: React.FC<ContinueDraftModalProps> = ({
  open,
  onClose,
  onContinueDraft,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white fixed inset-0 flex items-center justify-center bg-opacity-50">
        <div className="p-8 bg-white rounded-lg w-full max-w-md shadow-lg text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 scale-150"
          >
            <FiX />
          </button>
          <h2 className="text-2xl font-bold mb-4">Incomplete Exercise Log</h2>
          <p className="text-lg mb-8">
            Keep logging your exercise to track your progress, stay motivated,
            and reach your goals.
          </p>
          <div className="flex justify-between flex-col items-center h-28">
            <BasicRoundedButton
              onClick={onContinueDraft}
              label="Continue Editing"
              buttonClassNames="defaultButtonColor"
            />

            <BasicRoundedButton
              onClick={onClose}
              label="Create New Log"
              buttonClassNames="secondaryButtonColor"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContinueDraftModal;
