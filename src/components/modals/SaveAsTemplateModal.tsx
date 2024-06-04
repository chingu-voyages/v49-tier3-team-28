import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { Modal } from "@mui/material";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface SaveAsTemplateModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
  open,
  onClose,
  data,
}) => {
  const handleSaveLog = async (isTemplate: boolean = false) => {
    if (session?.user?._id) {
      const logData = [
        {
          exercises: data.map((exerciseActivity) => {
            return {
              exerciseName: exerciseActivity.exerciseName,
              sets: exerciseActivity.sets.map((set, index) => {
                return {
                  setNumber: index + 1,
                  weight: 0,
                  unit: "lbs",
                  reps: 0,
                };
              }),
            };
          }),
          isTemplate: true,
        },
      ];

      try {
        await LoggingClient.saveLog({
          logs: logData,
        });
      } catch (error: any) {
        //TODO: we need some UI feedback to show the user that the log was not saved
        console.error("Error saving log: ", error.message);
      }
    }
  };

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
          <h3>
            You've successfully logged your exercises for today. Keep up the
            fantastic work!
          </h3>
        </div>
        <div className="flex flex-col justify-between h-28">
          <BasicRoundedButton
            onClick={() => handleSaveLog()}
            label="Add Log as Template"
          ></BasicRoundedButton>
        </div>
      </div>
    </Modal>
  );
};

export default SaveAsTemplateModal;
