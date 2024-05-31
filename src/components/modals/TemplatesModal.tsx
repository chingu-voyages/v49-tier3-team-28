import { Modal } from "@mui/material";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
}

const TemplatesModal: React.FC<TemplateModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
        <h1 className="text-4xl font-bold text-center">
          Choose From Templates
        </h1>
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FiX />
        </button>
        <h1>Please choose one template to start:</h1>
        <div> List of Templates shows up here</div>
        <div className="flex flex-col justify-between h-28">
          <BasicRoundedButton
            // onClick={onConfirm}
            label="Generate Log"
          ></BasicRoundedButton>
        </div>
      </div>
    </Modal>
  );
};

export default TemplatesModal;
