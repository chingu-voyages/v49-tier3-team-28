import { Log } from "@/models/log.model";
import React from "react";
import { FiEdit, FiMinusCircle } from "react-icons/fi";

// TODO: Update Functionality of View Template and Edit Template Buttons

interface TemplateCardProps {
  data: Log;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  data,
  onClick,
  onDelete,
  onEdit,
}) => {
  const exercisesToShow = data.exercises.slice(0, 5);

  return (
    <div
      className="border border-gray-300 shadow-md rounded-lg m-2 bg-white cursor-pointer min-h-[240px] hover:border-orange-500"
      onClick={onClick}
    >
      <div>
        <div className=" flex justify-center relative text-lg mb-2 bg-orange-500 p-2  text-white">
          <p className="verdanaFont">{data.name}</p>
          <button
            className="p-1 absolute top-2 left-2 text-white scale-125 hover:scale-150 transform duration-300 ease-out"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <FiEdit />
          </button>
          <button
            className="absolute top-3 right-2 text-red-500 scale-125 hover:scale-150 transform duration-300 ease-out"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <FiMinusCircle />
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
