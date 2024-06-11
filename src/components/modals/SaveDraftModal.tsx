import { Modal } from "@mui/material";
import { motion } from "framer-motion";
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
        <h1 className="text-xl verdanaFont ml-10 text-left darkCharcoal ">
          Are You Sure?
        </h1>
        <p className="robotoFont text-sm m-10 text-gray-500 text-left">
          You have unsaved exercise data. Do you want to save it before leaving?
        </p>
        <div className="flex justify-between flex-col items-center gap-4">
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
      </motion.div>
    </Modal>
  );
};

export default SaveDraftModal;
