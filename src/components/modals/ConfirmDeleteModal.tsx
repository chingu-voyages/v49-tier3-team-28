import { Modal } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  onDelete: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  title,
  message,
  onDelete,
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
        <h1 className="text-xl verdanaFont ml-10 text-left darkCharcoal mr-10">
          {title}
        </h1>
        <p className="robotoFont text-sm ml-10 text-gray-500 text-left">
          {message}
        </p>
        <div className="flex justify-between flex-col items-center gap-4">
          <BasicRoundedButton
            onClick={onDelete}
            label="Delete"
            buttonClassNames="defaultButtonColor"
          />
          <BasicRoundedButton
            onClick={onClose}
            label="Cancel"
            buttonClassNames="secondaryButtonColor"
          />
        </div>
      </motion.div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
