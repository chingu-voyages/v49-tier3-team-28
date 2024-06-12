import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
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

  return (
    <Modal open={open} onClose={onClose} className="modalOuterContainer">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="modalInnerContainer modalBgColor relative items-center"
      >
        {/* Templates to Choose From */}
        {exerciseData !== null ? (
          <div className="w-full p-4">
            <div className="flex justify-between mb-4 items-center">
              {/* TODO: For Exercise list we should have access to the log.name (template Name) */}
              <h2 className="openSansFont leading-7 text-2xl font-medium">
                Exercise List
              </h2>
              <button
                onClick={onClose}
                className="absolute top-8 right-6 scale-150 darkCharcoal"
              >
                <FiX />
              </button>
            </div>
            {/* Exercise Activity */}
            <div className="max-h-96 overflow-y-auto overflow-hidden">
              <AnimatePresence>
                {exerciseData.map((exercise, eIdx) => (
                  <motion.div
                    key={(exercise as any).id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: eIdx * 0.1 }}
                    className="rounded-xl mb-4 border border-gray-100 shadow-md relative"
                  >
                    <h4 className="text-white font-bold p-2 defaultButtonColor">
                      {exercise.exerciseName}
                    </h4>
                    <table className="w-full border-collapse bg-white">
                      {exercise.sets.map((set, eIdx) => (
                        <tbody key={eIdx}>
                          <tr>
                            <td className="p-2">
                              <b>{set.setNumber}</b> set
                            </td>
                            <td className="p-2">
                              <b>{set.weight}</b> {set.unit}{" "}
                            </td>
                            <td className="p-2 text-right">
                              <b>{set.reps}</b> reps
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-4 h-28">
          <BasicRoundedButton
            onClick={onClose}
            label="Back to Selection"
            buttonClassNames="defaultButtonColor"
          />
        </div>
      </motion.div>
    </Modal>
  );
};

export default TemplateDataModal;
