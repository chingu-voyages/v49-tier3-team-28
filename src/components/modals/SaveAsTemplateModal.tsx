import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import SuccessModal from "./SuccessModal";

interface SaveAsTemplateModalProps {
  open: boolean;
  onClose: () => void;
  data: ExerciseActivity[];
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
      <Modal open={open} onClose={onClose} className="p-4">
        <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly w-full ">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold futuraFont uppercase self-center">
              Add log as template
            </h1>
            <button onClick={onClose}>
              <FiX className="size-8 text-white blueGray rounded-full ml-2 p-2 hover:bg-stone-500" />
            </button>
          </div>

          <div>
            <h1 className="verdanaFont text-base">Give your yemplate a name</h1>
            <input
              type="text"
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template Name"
              className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
            />
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </div>

          <div>
            <h1 className="futuraFont font-medium text-xl">
              Please Review Your Template:
            </h1>
            <div>
              {data.map((exercise, index) => (
                <>
                  <div
                    className="flex justify-between items-center mb-1 defaultButtonColor p-2"
                    key={index}
                  >
                    <p className="text-white verdanaFont">
                      {exercise.exerciseName}
                    </p>
                  </div>
                  <div className="paleSalmon p-2">
                    <p className="text-black">
                      <b>{exercise.sets.length}</b> Sets
                    </p>
                  </div>
                </>
              ))}
            </div>
            <p className="verdanaFont text-xs mt-4 p-1">
              * Please note that only the exercise name and number of sets will
              be saved when adding the log as a template.
            </p>
          </div>
          <div className="flex flex-col justify-between h-28">
            <BasicRoundedButton
              onClick={() => handleSaveTemplate()}
              label="Save as a Template"
              buttonClassNames="defaultButtonColor"
            />
          </div>
        </div>
      </Modal>
      <SuccessModal open={isModalOpen} />
    </div>
  );
};

export default SaveAsTemplateModal;
