import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import TemplateDataModal from "./TemplateDataModal";

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
  onTemplateSelect: (template: ExerciseActivity[] | null) => void;
}

let mockData = {
  userId: "665291224e3640a167a73ae5",
  logs: [
    {
      date: "2024-05-31T20:04:02.485Z",
      name: "Template 1",
      exercises: [
        {
          exerciseName: "Walking Lunge",
          sets: [
            { setNumber: 1, weight: 0, unit: "lbs", reps: 8 },
            { setNumber: 2, weight: 2, unit: "lbs", reps: 0 },
          ],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 0, unit: "lbs", reps: 0 }],
        },
      ],
      isTemplate: true,
    },
    {
      date: "2024-05-31T20:04:02.485Z",
      name: "Template 2",
      exercises: [
        {
          exerciseName: "Walking Lunge",
          sets: [
            { setNumber: 1, weight: 3, unit: "lbs", reps: 8 },
            { setNumber: 2, weight: 2, unit: "lbs", reps: 4 },
          ],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
      ],
      isTemplate: true,
    },
  ],
};

const TemplatesModal: React.FC<TemplateModalProps> = ({
  open,
  onClose,
  onGenerate,
  onTemplateSelect,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    ExerciseActivity[] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const templates = mockData.logs.filter((log) => log.isTemplate);

  const handleTemplateClick = (template: ExerciseActivity[]) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
          <h1 className="text-4xl font-bold text-center">
            Choose From Templates
          </h1>
          <button className="absolute top-2 right-2" onClick={onClose}>
            <FiX />
          </button>
          <h1>Please choose one template to start:</h1>
          {/* Templates to Choose From */}
          {templates.map((template, idx) => (
            <div
              key={idx}
              className="cursor-pointer p-2 border-b hover:bg-orange-500 hover:text-white"
              onClick={() => handleTemplateClick(template.exercises)} //error due to createdAt being required in type Log
            >
              {template.name}
            </div>
          ))}
          <div className="flex flex-col justify-between h-28">
            <BasicRoundedButton onClick={onGenerate} label="Generate Log" />
          </div>
        </div>
      </Modal>
      <TemplateDataModal
        open={isModalOpen}
        onClose={handleCloseModal}
        exerciseData={selectedTemplate}
      />
    </div>
  );
};

export default TemplatesModal;
