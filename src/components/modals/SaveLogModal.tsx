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
      <Modal open={open} onClose={onClose}>
        <div className="bg-white fixed inset-0 flex items-center justify-center bg-opacity-70">
          <div className="flex flex-col justify-between m-4 mt-20 mb-20 pt-8 pb-8 bg-white rounded-3xl w-full max-w-md shadow-lg text-center relative h-fill-available">
            <button className="absolute top-4 right-4" onClick={onClose}>
              <FiX className="scale-150" />
            </button>
            <img
              src="/images/create-log-page/modal-splash.jpg"
              alt="modal-image"
              style={{ height: "50%", width: "50%" }}
              className="self-center mb-4"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl verdanaFont text-center darkCharcoal mb-4">
                GREAT JOB!
              </h1>
              <h3 className="robotoFont text-sm mb-10">
                You've successfully logged your exercises for today. Keep up the
                fantastic work!
              </h3>
              <h3 className="robotoFont text-sm mb-4">
                Do you want to save the log as a template as well?
              </h3>
            </div>
            <div className="flex flex-col justify-between h-28 items-center">
              <BasicRoundedButton
                onClick={() => setIsModalOpen(true)}
                label="Save Log as Template"
                customMaterialButtonStyles={{
                  backgroundColor: "#95A1A8",
                }}
              />
            </div>
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
