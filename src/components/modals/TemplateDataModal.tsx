import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface TemplateDataModalProps {
  open: boolean;
  onClose: () => void;
  exerciseData: ExerciseActivity[] | null; // TODO: I think we should be passing a log instead of exercise activities here
}

const TemplateDataModal: React.FC<TemplateDataModalProps> = ({
  open,
  onClose,
  exerciseData,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleUseTemplate = (exerciseData: ExerciseActivity[]) => {
    localStorage.setItem("selectedTemplate", JSON.stringify(exerciseData));
    router.push("/user/createlog");
  };

  return (
    <Modal open={open} onClose={onClose} className="p-4">
      <div className="flex flex-col w-1/2 h-3/4 p-4 bg-white rounded-xl relative justify-evenly w-full">
        {/* Templates to Choose From */}
        {exerciseData !== null ? (
          <div className="mt-4 w-full">
            <div className="flex justify-between mb-4">
              {/* TODO: For Exercise list we should have access to the log.name (template Name) */}
              <h2 className="futuraFont text-2xl leading-7 font-medium">
                Exercise List
              </h2>
              <button onClick={onClose}>
                <FiX className="size-5" />
              </button>
            </div>
            {/* Exercise Activity */}
            <div className="min-h-96 max-h-96 overflow-y-auto overflow-hidden">
              {exerciseData.map((exercise, eIdx) => (
                <div className="rounded-xl mb-4 border border-gray-100 shadow-md relative">
                  <h4 className="text-white font-bold p-2 defaultButtonColor">
                    {exercise.exerciseName}
                  </h4>
                  <table className="w-full border-collapse bg-white">
                    {exercise.sets.map((set, eIdx) => (
                      <tbody>
                        <td className="p-2">
                          <b>{set.setNumber}</b> set
                        </td>
                        <td className="p-2">
                          <b>{set.weight}</b> {set.unit}{" "}
                        </td>
                        <td className="p-2 text-right">
                          <b>{set.reps}</b> reps
                        </td>
                      </tbody>
                    ))}
                  </table>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex flex-col justify-between h-28 mt-4 w-full">
          <BasicRoundedButton
            onClick={onClose}
            label="Back to Selection"
            buttonClassNames="!w-full"
            customMaterialButtonStyles={{
              backgroundColor: "#95A1A8",
            }}
          />
          {pathname == "/user/mytemplates" && (
            <BasicRoundedButton
              onClick={() => handleUseTemplate(exerciseData!)}
              label="Use Template"
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TemplateDataModal;
