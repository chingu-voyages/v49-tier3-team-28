import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import SuccessModal from "./SuccessModal";

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
  const { session } = useAuthSession();

  const [unit, setUnit] = useState<string>("lbs");
  const [templateName, setTemplateName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedUnit = localStorage.getItem("weightUnit");
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  const handleSaveTemplate = async () => {
    if (!templateName) {
      setErrorMessage("Template name can't be empty.");
      return;
    }

    if (session?.user?._id) {
      const logData = [
        {
          name: templateName,
          exercises: data.map((exerciseActivity) => {
            return {
              exerciseName: exerciseActivity.exerciseName,
              sets: exerciseActivity.sets.map((set, index) => {
                return {
                  setNumber: index + 1,
                  weight: set.weight,
                  unit: unit,
                  reps: set.reps,
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
    setIsModalOpen(true);
  };

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

          <div className="px-4 items-center">
            <input
              type="text"
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template Name"
              className="border rounded-xl p-2 bg-gray-50 w-full text-center"
            />
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </div>

          <div>
            <h1>Please Review Your Template</h1>
            <div>
              {data.map((exercise, index) => (
                <div
                  className="flex justify-between items-center mb-1"
                  key={index}
                >
                  <div className="text-gray-700">{exercise.exerciseName}</div>
                  <div className="text-gray-500">
                    Sets: {exercise.sets.length}
                  </div>
                </div>
              ))}
            </div>
            <p>
              * Please note that only the exercise name and number of sets will
              be saved when adding the log as a template.
            </p>
          </div>

          <div className="flex flex-col">
            <h3>
              You've successfully logged your exercises for today. Keep up the
              fantastic work!
            </h3>
          </div>
          <div className="flex flex-col justify-between h-28">
            <BasicRoundedButton
              onClick={() => handleSaveTemplate()}
              label="Save Template"
            ></BasicRoundedButton>
          </div>
        </div>
      </Modal>
      <SuccessModal open={isModalOpen} />
    </div>
  );
};

export default SaveAsTemplateModal;
