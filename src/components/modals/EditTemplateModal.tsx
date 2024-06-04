import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface EditTemplateModalProps {
  open: boolean;
  onClose: () => void;
  templateData: ExerciseActivity[] | null;
  onUpdateTemplate: (updatedTemplateData: any) => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  open,
  onClose,
  templateData,
  onUpdateTemplate,
}) => {
  const [templateName, setTemplateName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);

  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseActivity[]
  >([]);

  const exercisesArray = Object.values(ExercisesDictionary);

  useEffect(() => {
    if (templateData) {
      setSelectedExercises(templateData);
    }
  }, [templateData]);

  useEffect(() => {
    if (searchInput) {
      const results = exercisesArray.filter((exercise) =>
        exercise.label.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  const handleSelectExercise = (exercise: Exercise): ExerciseActivity => {
    const newExercise: ExerciseActivity = {
      exerciseName: exercise.label,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit: "lbs" }],
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setSearchInput("");
    setSearchResults([]);

    return newExercise;
  };

  const handleDeleteExercise = (index: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.splice(index, 1);
    setSelectedExercises(newSelectedExercises);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Edit Template</h2>
        <div>
          <input
            type="text"
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter a name for your template"
            className="border rounded-xl p-2 bg-gray-50 w-full text-center"
          />

          {errorMessage && (
            <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex flex-col min-w-80">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for an exercise"
              className="border rounded-xl pl-10 pr-10 p-2 w-full bg-gray-50"
            />
            {searchInput && (
              <FiX
                className="absolute right-3 cursor-pointer"
                onClick={() => setSearchInput("")}
              />
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full bg-gray-50 left-0 right-0 flex flex-col border rounded shadow-lg z-10 overflow-y-auto max-h-48">
              {searchResults.map((exercise: Exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => handleSelectExercise(exercise)}
                  className="cursor-pointer p-2 border-b hover:bg-orange-500 hover:text-white"
                >
                  {exercise.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedExercises.map((exercise, index) => (
            <div
              key={index}
              className="rounded-xl mb-4 border border-gray-100 shadow-md relative"
            >
              <h4 className="text-black font-bold p-2 text-center ">
                {exercise.exerciseName}
              </h4>
              <input
                type="text"
                value={exercise.sets.length}
                className="mb-2 p-2 border rounded w-full"
                placeholder="Exercise Name"
              />

              <button
                onClick={() => handleDeleteExercise(index)}
                className="absolute top-2 right-2"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <BasicRoundedButton label="Cancel" onClick={onClose} />
          <BasicRoundedButton
            label="Save"
            onClick={() => {}}
            className="ml-2"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditTemplateModal;
