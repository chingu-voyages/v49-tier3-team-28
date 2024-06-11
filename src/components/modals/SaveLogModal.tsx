import { Modal } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import SaveAsTemplateModal from "./SaveAsTemplateModal";

interface SaveLogModalProps {
  open: boolean;
  onClose: () => void;
  data?: any;
}

const SaveLogModal: React.FC<SaveLogModalProps> = ({ open, onClose, data }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <Modal open={open} onClose={onClose} className="modalOuterContainer">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="modalInnerContainer modalBgColor shadow-lg relative"
        >
          <Link href="/user/home" className="absolute top-8 right-6">
            <FiX className="scale-150 darkCharcoal" />
          </Link>
          <img
            src="/savelog.svg"
            alt="modal-image"
            className="self-center mb-4"
          />
          <div className="flex flex-col">
            <h1 className="text-xl verdanaFont text-center darkCharcoal">
              GREAT JOB!
            </h1>
            <h3 className="robotoFont text-sm m-10 text-gray-500">
              You've successfully logged your exercises for today. Keep up the
              fantastic work!
            </h3>
          </div>
          <div className="flex flex-col justify-between items-center">
            <BasicRoundedButton
              onClick={() => setIsModalOpen(true)}
              label="Save Log as Template"
              buttonClassNames="defaultButtonColor"
            />
          </div>
        </motion.div>
      </Modal>
      <SaveAsTemplateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
      />
    </div>
  );
};

export default SaveLogModal;
