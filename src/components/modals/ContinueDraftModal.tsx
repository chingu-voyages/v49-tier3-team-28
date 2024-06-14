import { Modal } from "@mui/material";
import { motion } from "framer-motion";
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
    <Modal open={open} onClose={onClose} className="modalOuterContainer">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="modalInnerContainer modalBgColor shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-6 scale-150 darkCharcoal"
        >
          <FiX />
        </button>
        <img
          src="/incomplete.svg"
          alt="modal-image"
          className="mb-4 self-center"
        />
        <h1 className="text-xl verdanaFont text-center darkCharcoal">
          Incomplete Exercise Log
        </h1>
        <h3 className="robotoFont text-sm m-10 text-gray-500">
          Keep logging your exercise to track your progress, stay motivated, and
          reach your goals.
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
            buttonClassNames="whiteButton"
          />
        </div>
      </motion.div>
    </Modal>
  );
};

export default ContinueDraftModal;
