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
      <div className="bg-white fixed inset-0 flex items-center justify-center bg-opacity-70">
        <div className="m-4 mt-10 mb-10 pt-8 pb-8 modalBgColor rounded-3xl w-full max-w-md sm:w-3/4 shadow-lg text-center relative max-h-min flex flex-col justify-center items-center">
          <button
            onClick={onClose}
            className="absolute top-8 right-6 scale-150 darkCharcoal"
          >
            <FiX />
          </button>
          <img src="/incomplete.svg" alt="modal-image" className="mb-4" />
          <h1 className="text-xl verdanaFont text-center darkCharcoal">
            Incomplete Exercise Log
          </h1>
          <h3 className="robotoFont text-sm m-10 text-gray-500">
            Keep logging your exercise to track your progress, stay motivated,
            and reach your goals.
          </h3>
          <div className="flex gap-4 flex-col items-center">
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
