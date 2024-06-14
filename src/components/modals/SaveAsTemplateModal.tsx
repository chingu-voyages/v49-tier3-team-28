import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { CircularProgress, Modal } from "@mui/material";
import { motion } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedUnit = localStorage.getItem("weightUnit");
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  const handleSaveTemplate = async () => {
    if (!templateName || templateName.trim() === "") {
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
                  weight: 0,
                  unit: unit,
                  reps: 0,
                };
              }),
            };
          }),
          isTemplate: true,
        },
      ];

      try {
        setIsLoading(true);
        await LoggingClient.saveLog({
          logs: logData,
        });
        setIsModalOpen(true);
        onClose();
      } catch (error: any) {
        setErrorMessage(error.message);
        return;
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="absolute left-1/2 inset-y-1/4">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <motion.div
          initial={{ opacity: 0, y: "-100vh" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col bg-white p-2 relative gap-4 h-fill-available"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex flex-col gap-6 pt-8 pb-8 bg-white w-full max-w-md text-center relative overflow-y-auto max-h-screen"
          >
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold openSansFont uppercase ml-4 text-nowrap self-center">
                Add log as template
              </h1>
              <button onClick={onClose}>
                <FiX className="size-12 text-white blueGray rounded-full ml-2 mr-4 p-2 hover:bg-stone-500" />
              </button>
            </div>

            <div className="ml-4 mr-4">
              <h1 className="verdanaFont mt-2 text-left text-gray-500 text-sm">
                Give your template a name
              </h1>
              <input
                type="text"
                id="templateName"
                value={templateName}
                maxLength={50}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name"
                className="mt-2 pl-4 w-full bg-gray-50 robotoFont h-16 text-xl hover:bg-neutral-300"
              />
              {errorMessage && (
                <p className="text-red-500 mt-2 font-light text-sm">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="m-4 text-left flex flex-col gap-8">
              <h1 className="openSansFont font-medium text-lg leading-7">
                Please review your template:
              </h1>
              <div>
                {data.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 * (index + 1), duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-1 defaultButtonColor p-2">
                      <p className="text-white verdanaFont">
                        {exercise.exerciseName}
                      </p>
                    </div>
                    <div className="paleSalmon p-2">
                      <p className="text-black">
                        <b>{exercise.sets.length}</b> Sets
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="verdanaFont text-xs mt-4 p-1">
                * Please note that only the exercise name and number of sets
                will be saved when adding the log as a template.
              </p>
            </div>

            <div className="flex flex-col justify-between h-28 self-center">
              <BasicRoundedButton
                onClick={() => handleSaveTemplate()}
                label="Save as a Template"
                disabled={!templateName}
                buttonClassNames={templateName! && "defaultButtonColor"}
              />
            </div>
          </motion.div>
        </motion.div>
      </Modal>
      <SuccessModal open={isModalOpen} />
    </div>
  );
};

export default SaveAsTemplateModal;
