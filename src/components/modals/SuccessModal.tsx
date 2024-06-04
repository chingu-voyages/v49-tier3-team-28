import { Modal } from "@mui/material";
import Link from "next/link";
import React from "react";
import { FiX } from "react-icons/fi";

interface SuccessModalProps {
  open: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open }) => {
  return (
    <Modal open={open} className="flex justify-center items-center">
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
        <Link href={"/user/mytemplates"}>
          <button className="absolute top-2 right-2">
            <FiX />
          </button>
        </Link>
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
          <Link href={"/user/home"}> Return to Home </Link>
          <Link href={"/user/mytemplates"}> View Templates </Link>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
