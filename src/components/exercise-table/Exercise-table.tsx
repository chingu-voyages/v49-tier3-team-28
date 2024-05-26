import React from "react";

// Define the Set type
interface Set {
  reps: number;
  weight: number;
}

// Define the Exercise type
interface ExerciseEntry extends Exercise { 
  sets: Set[];
}
  id: number;
  name: string;
  label: string;
  bodyPart: string;
  sets: Set[];
}

interface ExerciseTableProps {
  exercise: Exercise;
  handleSetChange: (
    index: number,
    setIndex: number,
    field: string,
    value: string
  ) => void;
  handleAddSet: () => void;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercise,
  handleSetChange,
  handleAddSet,
}) => {
  return (
    <div className="p-2 border rounded mb-4">
      <h4>{exercise.label}</h4>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Set</th>
            <th className="border p-2">Reps</th>
            <th className="border p-2">Weight (lbs)</th>
          </tr>
        </thead>
        <tbody>
          {exercise.sets.map((set, setIndex: number) => (
            <tr key={setIndex}>
              <td className="border p-2 text-center">{setIndex + 1}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(index, setIndex, "reps", e.target.value)
                  }
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) =>
                    handleSetChange(index, setIndex, "weight", e.target.value)
                  }
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddSet}
        className="mt-2 p-2 border rounded bg-blue-500 text-white"
      >
        Add Set
      </button>
    </div>
  );
};

export default ExerciseTable;
