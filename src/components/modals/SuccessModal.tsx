import { Modal } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface SuccessModalProps {
  open: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open }) => {
  return (
    <Modal open={open}>
      <div className="flex flex-col gap-4 modalBgColor p-6 rounded-3xl relative justify-evenly max-h-min ml-4 mr-4 mt-10 mb-10">
        <div className="flex justify-center">
          <Image
            src="/success.svg"
            width={250}
            height={250}
            alt="modal-image"
          />
        </div>
        <div>
          <div className="flex flex-col gap-">
            <h1 className="text-xl verdanaFont text-center darkCharcoal">
              SUCCESS!
            </h1>
            <h3 className="robotoFont text-sm m-6 text-gray-500">
              Your exercise template has been saved successfully. You can now
              re-use this template to log your exercises next time!
            </h3>
          </div>
          <div className="mt-2 flex flex-col gap-4 px-4 items-center">
            <Link href={"/user/home"}>
              <BasicRoundedButton
                label="Return To Home"
                buttonClassNames="secondaryButtonColor"
              />
            </Link>
            <Link href={"/user/mytemplates"}>
              <BasicRoundedButton
                label="View Templates"
                buttonClassNames="defaultButtonColor"
              />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
