import { Modal } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SuccessModalProps {
  open: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open }) => {
  return (
    <Modal open={open} className="p-4">
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-6 rounded-xl relative justify-evenly w-full">
        <Image
          src="/images/create-log-page/modal-splash.jpg"
          width={500}
          height={500}
          alt="modal-image"
        />
        <div>
          <h1 className="text-2xl verdanaFont text-center">SUCCESS!</h1>
          <h3 className="robotoFont text-sm text-justify">
            Your exercise template has been saved successfully.<br></br> You can
            now re-use this template to log your exercises next time!
          </h3>
          <div className="mt-2 flex flex-col gap-2 px-4">
            <Link
              className="rounded-3xl bg-slate-300 p-2 text-center"
              href={"/user/home"}
            >
              Return to Home
            </Link>
            <Link
              className="rounded-3xl bg-slate-300 p-2 text-center"
              href={"/user/mytemplates"}
            >
              View Templates
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
