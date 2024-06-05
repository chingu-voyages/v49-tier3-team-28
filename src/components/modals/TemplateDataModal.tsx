import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface TemplateDataModalProps {
  open: boolean;
  onClose: () => void;
  exerciseData: ExerciseActivity[] | null;
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
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
        {/* Templates to Choose From */}
        {exerciseData !== null ? (
          <div className="mt-4 w-full">
            <button className="absolute top-2 right-2" onClick={onClose}>
              <FiX />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Exercise List</h2>

            {/* Exercise Activity */}
            <div className="min-h-96 max-h-96 overflow-y-auto overflow-hidden">
              <div className="rounded-xl mb-4 border border-gray-100 shadow-md relative">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="text-white text-center bg-orange-500 p-2">
                      <th className="p-left-2">Exercise Name</th>
                      <th className="p-left-2"># of Sets</th>
                    </tr>
                  </thead>
                  {exerciseData.map((exercise, eIdx) => (
                    <tbody>
                      <td className="p-2 text-center">
                        {exercise.exerciseName}
                      </td>
                      <td className="p-2 text-center">
                        {exercise.sets.length}
                      </td>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col justify-between h-28 mt-4">
          <BasicRoundedButton onClick={onClose} label="Back to Selection" />
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
