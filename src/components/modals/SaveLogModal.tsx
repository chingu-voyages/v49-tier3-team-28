import { Modal } from "@mui/material";
import React from "react";
import { FiX } from "react-icons/fi";

interface SaveLogModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SaveLogModal: React.FC<SaveLogModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col w-2/3 h-2/3 bg-white p-10 rounded-xl text-center relative justify-evenly">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FiX />
        </button>
        <image>Image Goes Here</image>
        <div className="flex flex-col">
          <h1> Great Job! </h1>
          <h3>
            You've successfully logged your exercises for today. Keep up the
            fantastic work!
          </h3>
        </div>
        <div className="flex flex-col">
          <button onClick={onConfirm}>Done</button>
          <button>Add Log as Template</button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveLogModal;
