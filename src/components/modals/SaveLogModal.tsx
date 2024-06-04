import { Modal } from "@mui/material";
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
      <Modal
        open={open}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
          <button className="absolute top-2 right-2" onClick={onClose}>
            <FiX />
          </button>
          <img
            src="/images/create-log-page/modal-splash.jpg"
            alt="modal-image"
            style={{ height: "50%" }}
          />
          <div className="flex flex-col">
            <h1 className="text-2xl"> GREAT JOB! </h1>
            <h3>
              You've successfully logged your exercises for today. Keep up the
              fantastic work!
            </h3>
            <h3>Do you want to save the log as a template as well?</h3>
          </div>
          <div className="flex flex-col justify-between h-28">
            <BasicRoundedButton
              onClick={() => setIsModalOpen(true)}
              label="Save Log as Template"
            ></BasicRoundedButton>
          </div>
        </div>
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
