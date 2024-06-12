import { Log } from "@/models/log.model";
import React, { useState } from "react";
import { FiMinusCircle } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

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
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // const exercisesToShow = isOpen ? data.exercises : [];

  return (
    <div className="border shadow-md bg-white cursor-pointer" onClick={onClick}>
      <div>
        <div className="flex justify-between items-center relative text-lg p-4 cursor-pointer lightTanOrange ">
          <p className="verdanaFont">{data.name}</p>
          <div className="flex items-center gap-2">
            <button
              className="scale-125 hover:scale-150 transform duration-300 ease-out"
              onClick={toggleAccordion}
            >
              {isOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
            </button>
            <button
              className=" text-red-500 scale-125 hover:scale-150 transform duration-300 ease-out"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <FiMinusCircle />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <div>
        {isOpen && (
          <div>
            {data.exercises.map((exercise, index) => (
              <div
                className="flex justify-between items-center p-2 mt-1 mb-1 modalBgColor"
                key={index}
              >
                <div>{exercise.exerciseName}</div>
                <div>{exercise.sets.length} set(s)</div>
              </div>
            ))}

            <div className="modalBgColor">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex gap-1 items-center p-2 hover:scale-110 transition ease-in-out duration-100"
              >
                <MdEdit style={{ color: "#03BB9B" }} />
                <p className="text-sm font-bold" style={{ color: "#03BB9B" }}>
                  Edit
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
