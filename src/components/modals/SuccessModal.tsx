import { Modal } from "@mui/material";
import React from "react";
import { FiX } from "react-icons/fi";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  return (
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
          <h1 className="text-2xl"> SUCCESS! </h1>
          <h3>
            Your exercise template has been saved successfully. You can now
            reuse this template to log your exercises next time!
          </h3>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
