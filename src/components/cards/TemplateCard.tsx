import { Log } from "@/models/log.model";
import React from "react";
import { FiEdit } from "react-icons/fi";

// TODO: Update Functionality of View Template and Edit Template Buttons

interface TemplateCardProps {
  data: Log;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ data, onClick }) => {
  const exercisesToShow = data.exercises.slice(0, 5);

  return (
    <div
      className="border border-gray-300 shadow-md rounded-lg m-2 bg-white cursor-pointer min-h-[240px] hover:border-orange-500"
      onClick={onClick}
    >
      <div>
        <div className="relative font-bold text-lg mb-2 bg-orange-500 p-2 rounded-t-lg text-white">
          {data.name}

          <button className="absolute top-2 right-2">
            <FiEdit />
          </button>
        </div>
      </div>
      <div className="p-4">
        {exercisesToShow.map((exercise, index) => (
          <div className="flex justify-between items-center mb-1" key={index}>
            <div className="text-gray-700">{exercise.exerciseName}</div>
            <div className="text-gray-500">Sets: {exercise.sets.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateCard;
