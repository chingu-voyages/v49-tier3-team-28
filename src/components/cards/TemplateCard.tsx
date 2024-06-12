import { Log } from "@/models/log.model";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { PiTrashFill } from "react-icons/pi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

interface TemplateCardProps {
  data: Log;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isSelected: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  data,
  onClick,
  onDelete,
  onEdit,
  isSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    hidden: { opacity: 1, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="border shadow-md bg-white cursor-pointer" onClick={onClick}>
      <div>
        <div
          className={`flex justify-between items-center relative text-lg p-4 cursor-pointer ${
            isSelected
              ? "bg-orange-500 text-white"
              : "lightTanOrange text-black"
          }`}
        >
          <p className="verdanaFont text-base leading-6">{data.name}</p>
          <div className="flex items-center gap-2">
            <button
              className="scale-125 hover:scale-150 transform duration-300 ease-out"
              onClick={toggleAccordion}
            >
              {isOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={containerVariants}
            style={{ overflow: "hidden" }}
          >
            {data.exercises.map((exercise, index) => (
              <motion.div
                className="flex justify-between items-center p-2 mt-1 mb-1 modalBgColor"
                key={index}
                variants={itemVariants}
              >
                <div className="pl-1">
                  <p className="verdanaFont text-sm leading-6">
                    {exercise.exerciseName}
                  </p>
                </div>
                <div>
                  <p className="verdanaFont text-sm leading-6">
                    {exercise.sets.length} set{exercise.sets.length > 1 && "s"}
                  </p>
                </div>
              </motion.div>
            ))}

            <div className="modalBgColor flex justify-between">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex gap-1 items-center p-2 hover:scale-110 transition ease-in-out duration-100"
              >
                <PiTrashFill
                  style={{ color: "#03BB9B" }}
                  className="text-red-500"
                />
                <p className="text-sm font-bold" style={{ color: "#03BB9B" }}>
                  Delete
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateCard;
