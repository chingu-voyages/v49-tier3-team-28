import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { Set } from "@/models/set.model";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

interface EditTemplateModalProps {
  open: boolean;
  onClose: () => void;
  templateData: ExerciseActivity[] | null;
  templateNameData: string | null;
  onUpdateTemplate: (updatedTemplateData: Partial<Log>) => void;
  templateId: string | null;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  open,
  onClose,
  templateData,
  templateNameData,
  onUpdateTemplate,
  templateId,
}) => {
  const [templateName, setTemplateName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseActivity[]
  >([]);
  const [toggleSearchBar, setToggleSearchBar] = useState<boolean>(false);

  const exercisesArray = Object.values(ExercisesDictionary);

  useEffect(() => {
    if (templateData) {
      setSelectedExercises(templateData);
    }
  }, [templateData]);

  useEffect(() => {
    if (templateNameData) {
      setTemplateName(templateNameData);
    }
  }, [templateNameData]);

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

  const handleSetNumberChange = (index: number, newSetNumber: number) => {
    const updatedExercises = [...selectedExercises];
    const exercise = updatedExercises[index];

    const setData = (set: Set, i: number) => ({
      setNumber: i + 1,
      reps: 0,
      weight: 0,
      unit: "lbs",
    });

    if (newSetNumber > 0) {
      exercise.sets = Array.from({ length: newSetNumber }, setData);
    }

    setSelectedExercises(updatedExercises);
  };

  const handleSave = () => {
    if (!templateName) {
      setErrorMessage("Template name can't be empty.");
      return;
    }

    const updatedTemplateData = {
      _id: templateId!,
      name: templateName,
      exercises: selectedExercises.map((exerciseActivity) => ({
        exerciseName: exerciseActivity.exerciseName,
        sets: exerciseActivity.sets.map((set, index) => ({
          setNumber: index + 1,
          weight: 0,
          unit: set.unit,
          reps: 0,
        })),
      })),
      isTemplate: true,
    };

    // console.log(updatedTemplateData);
    onUpdateTemplate(updatedTemplateData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
        <h2 className="text-2xl font-bold">Edit Template</h2>
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FiX />
        </button>

        {/* Template Name */}
        <div className="w-full">
          <h1 className="text-xl mb-2">Template Name</h1>
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
        {toggleSearchBar ? (
          <div className="relative flex flex-col w-full">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for an exercise to add"
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
        ) : (
          <div>
            <button
              className="flex text-green-500 justify-center w-full text-center"
              onClick={() => setToggleSearchBar(true)}
            >
              <FiPlus />
              <p>Add Exercise</p>
            </button>
          </div>
        )}

        {/* Exercise Table */}
        <div className="w-full max-h-48 overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-white text-center bg-orange-500">
                <th className="p-2">Exercise Name</th>
                <th className="p-2"># of Sets</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {selectedExercises.map((exercise, eIdx) => (
                <tr key={eIdx} className="text-center">
                  <td className="p-2">{exercise.exerciseName}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={exercise.sets.length}
                      onChange={(e) =>
                        handleSetNumberChange(eIdx, Number(e.target.value))
                      }
                      className="mb-2 mt-2 p-1 border rounded-xl w-1/2 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleDeleteExercise(eIdx)}>
                      <FiX />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <BasicRoundedButton label="Save" onClick={handleSave} />
        </div>
      </div>
    </Modal>
  );
};

export default EditTemplateModal;
