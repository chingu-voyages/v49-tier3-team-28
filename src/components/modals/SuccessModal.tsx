import { Modal } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SuccessModalProps {
  open: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open }) => {
  return (
    <Modal open={open}>
      <div className="flex flex-col gap-4 bg-gray-100 p-6 rounded-3xl relative justify-evenly h-fill-available ml-4 mr-4 mt-10 mb-10">
        <div className="flex justify-center">
          <Image
            src="/success.svg"
            width={250}
            height={250}
            alt="modal-image"
          />
        </div>
        <div>
          <h1 className="text-2xl verdanaFont text-center">SUCCESS!</h1>
          <h3 className="robotoFont text-sm text-center mb-4">
            Your exercise template has been saved successfully. You can now
            re-use this template to log your exercises next time!
          </h3>
          <div className="mt-2 flex flex-col gap-4 px-4">
            <Link
              className="rounded-3xl bg-slate-500 p-2 text-white font-semibold text-center hover:bg-slate-600"
              href={"/user/home"}
            >
              Return to Home
            </Link>
            <Link
              className="rounded-3xl bg-orange-500 p-2 text-white font-semibold text-center hover:bg-orange-600"
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
