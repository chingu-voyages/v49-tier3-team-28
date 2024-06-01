import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import React from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";

interface TemplateDataModalProps {
  open: boolean;
  onClose: () => void;
  exerciseData: ExerciseActivity;
}

const TemplateDataModal: React.FC<TemplateDataModalProps> = ({
  open,
  onClose,
  exerciseData,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
        {/* Templates to Choose From */}
        {exerciseData !== null ? (
          <div className="mt-4">
            <button className="absolute top-2 right-2" onClick={onClose}>
              <FiX />
            </button>
            <h2 className="text-2xl font-semibold">Exercises</h2>
            {exerciseData.map((exercise, eIdx) => (
              <div key={eIdx} className="mt-2">
                <h3 className="text-xl font-medium">{exercise.exerciseName}</h3>
                {exercise.sets.map((set, sIdx) => (
                  <div key={sIdx} className="text-left ml-4">
                    <p>
                      Set {set.setNumber}: {set.reps} reps, {set.weight}{" "}
                      {set.unit}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex flex-col justify-between h-28">
          <BasicRoundedButton onClick={onClose} label="Back to Selection" />
        </div>
      </div>
    </Modal>
  );
};

export default TemplateDataModal;
