import { Set } from "@/models/set.model";
import React from "react";
import { FiTrash, FiX } from "react-icons/fi";

interface ExerciseTableProps {
  sets: Set[];
  exerciseName: string;
  unit: string;
  onDeleteSet: (setIndex: number) => void;
  onSetChange: (setIndex: number, field: keyof Set, value: number) => void;
  onDeleteExercise: (index: number) => void;
  idx: number;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
  sets,
  exerciseName,
  unit,
  onDeleteSet,
  onSetChange,
  onDeleteExercise,
  idx,
}) => {


  const handleInputChange = (
    setIndex: number,
    field: keyof Set,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    let newValue = parseFloat(e.target.value)

    onSetChange(setIndex, field, newValue);
  };

  const handleBlur = (setIndex: number, field: keyof Set, e: React.ChangeEvent<HTMLInputElement>) => {

    const value = parseFloat(e.target.value.replace(/^0+/, "")) || 0

    onSetChange(setIndex, field, value)
  }


  return (
    <>
      <h4 className="text-white text-sm font-bold p-2 defaultButtonColor">
        {exerciseName}
      </h4>

      <button
        onClick={() => onDeleteExercise(idx)}
        className="absolute top-2 right-2 text-white"
      >
        <FiX />
      </button>
      <table className="w-full border-collapse bg-white">
        <tbody>
          {sets.map((set, setIndex) => (
            <tr
              key={setIndex}
              className="odd:bg-orange-100 text-center text-sm"
            >
              <td className="p-2 text-center">{setIndex + 1}</td>

              <td className="p-2">
                <div className="flex">
                  <input
                    type="number"
                    value={set.weight.toString()}
                    onChange={(e) => handleInputChange(setIndex, "weight", e)}
                    className="w-20 p-1 border rounded-xl text-center bg-gray-50"
                    placeholder="0"
                    onBlur={(e) => handleBlur(setIndex, "weight", e)}
                  />
                  <div className="self-center">
                    <p className="px-2">{unit}</p>
                  </div>
                </div>
              </td>
              <td className="p-2 text-center ">
                <div className="flex">
                  <input
                    type="number"
                    value={set.reps.toString()}
                    onChange={(e) => handleInputChange(setIndex, "reps", e)}
                    className="w-20 p-1 border rounded-xl text-center bg-gray-50"
                    placeholder="0"
                    onBlur={(e) => handleBlur(setIndex, "reps", e)}
                  />
                  <p className="px-2 self-center">reps</p>
                </div>
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
    </>
  );
};

export default ExerciseTable;
