import { Set } from "@/models/set.model";
import React from "react";
import { FiTrash } from "react-icons/fi";

interface ExerciseTableProps {
  sets: Set[];
  unit: string;
  onDeleteSet: (setIndex: number) => void;
  onSetChange: (setIndex: number, field: keyof Set, value: number) => void;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
  sets,
  unit,
  onSetChange,
  onDeleteSet,
}) => {
  const handleInputChange = (
    setIndex: number,
    field: keyof Set,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseFloat(e.target.value);
    onSetChange(setIndex, field, newValue);
  };

  return (
    <table className="w-full border-collapse bg-white">
      <thead>
        <tr className="text-white text-center bg-orange-500">
          <th className="p-left-2 font-bold">Set</th>
          <th className="p-2">Reps</th>
          <th className="p-2">Weight ({unit})</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {sets.map((set, setIndex) => (
          <tr key={setIndex} className="odd:bg-orange-100 text-center">
            <td className="p-2 text-center">{setIndex + 1}</td>
            <td className="p-2 text-center ">
              <input
                type="number"
                value={set.reps}
                onChange={(e) => handleInputChange(setIndex, "reps", e)}
                className="w-3/4 p-1 border rounded-xl text-center bg-gray-50"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                value={set.weight}
                onChange={(e) => handleInputChange(setIndex, "weight", e)}
                className="w-3/4 p-1 border rounded-xl text-center bg-gray-50"
              />
            </td>
            <td className="p-1">
              {sets.length > 1 && (
                <button
                  onClick={() => onDeleteSet(setIndex)}
                  className=" text-red-500"
                >
                  <FiTrash />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExerciseTable;
