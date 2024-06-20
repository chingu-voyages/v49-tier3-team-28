import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { FormControl, MenuItem, Select, styled } from "@mui/material";
import { useState } from "react";
import { FiX } from "react-icons/fi";

type ExerciseActivityWithId = ExerciseActivity & { id: string };

interface TemplateExerciseTableProps {
  onSetCountChange: (id: string, setCount: number) => void;
  onDeleteExercise: (id: string) => void;
  exerciseActivity: ExerciseActivityWithId;
}

export function TemplateExerciseTable({
  exerciseActivity,
  onDeleteExercise,
  onSetCountChange,
}: TemplateExerciseTableProps) {
  const [setCount, setSetCount] = useState<number>(
    exerciseActivity.sets.length
  );

  return (
    <div>
      {/* Header with exercise name and close button */}
      <h4 className="text-white text-sm font-bold p-2 defaultButtonColor">
        {ExercisesDictionary[exerciseActivity.exerciseName as ExerciseEnum]
          ?.label || exerciseActivity.exerciseName}
      </h4>
      <button
        onClick={() => onDeleteExercise(exerciseActivity.id)}
        className="absolute top-2 right-2 text-white"
      >
        <FiX />
      </button>
      <div className="bg-orange-100 p-1 flex flex-col">
        <div className="self-start p-2">
          <p className="verdanaFont text-base">Sets:</p>
        </div>
        <FormControl
          sx={{
            background: "white",
            width: "100%",
          }}
        >
          <Select
            labelId="sets-count-dropdown"
            value={setCount}
            onChange={(e) => {
              const count: number = e.target.value as number;
              onSetCountChange(exerciseActivity.id, count);
              setSetCount(count);
            }}
            sx={{
              height: "40px",
              borderRadius: "0px",
            }}
            MenuProps={{
              style: {
                maxHeight: 300,
              },
            }}
          >
            <StyledCustomMenuItem value={1}>1</StyledCustomMenuItem>
            <StyledCustomMenuItem value={2}>2</StyledCustomMenuItem>
            <StyledCustomMenuItem value={3}>3</StyledCustomMenuItem>
            <StyledCustomMenuItem value={4}>4</StyledCustomMenuItem>
            <StyledCustomMenuItem value={5}>5</StyledCustomMenuItem>
            <StyledCustomMenuItem value={6}>6</StyledCustomMenuItem>
            <StyledCustomMenuItem value={7}>7</StyledCustomMenuItem>
            <StyledCustomMenuItem value={8}>8</StyledCustomMenuItem>
            <StyledCustomMenuItem value={9}>9</StyledCustomMenuItem>
            <StyledCustomMenuItem value={10}>10</StyledCustomMenuItem>
            <StyledCustomMenuItem value={11}>11</StyledCustomMenuItem>
            <StyledCustomMenuItem value={12}>12</StyledCustomMenuItem>
            <StyledCustomMenuItem value={13}>13</StyledCustomMenuItem>
            <StyledCustomMenuItem value={14}>14</StyledCustomMenuItem>
            <StyledCustomMenuItem value={15}>15</StyledCustomMenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

const StyledCustomMenuItem = styled(MenuItem)(() => ({
  "&.MuiButtonBase-root:hover": {
    background: "var(--orange)",
    color: "white",
    opacity: 0.8,
  },
}));
