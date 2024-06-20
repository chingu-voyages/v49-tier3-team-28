import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { Exercise } from "@/lib/exercises/exercise";
import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { Set } from "@/models/set.model";
import { Modal } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiMinusCircle, FiPlus, FiSearch, FiX } from "react-icons/fi";

interface EditTemplateModalProps {
  open: boolean;
  onClose: () => void;
  templateData: ExerciseActivity[] | null;
  templateNameData: string | null;
  onUpdateTemplate: (updatedTemplateData: Partial<Log>) => void;
  templateId: string | null;
  updateTemplateError: string | null;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  open,
  onClose,
  templateData,
  templateNameData,
  onUpdateTemplate,
  templateId,
  updateTemplateError,
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

  const handleSelectExercise = (exercise: Exercise) => {
    const newExercise: ExerciseActivity = {
      exerciseName: exercise.name,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit: "lbs" }],
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setSearchInput("");
    setSearchResults([]);
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

    onUpdateTemplate(updatedTemplateData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col bg-white p-8 relative gap-4 h-fill-available"
      >
        {/* Header */}
        <div className="flex gap-8">
          <div className="self-center cursor-pointer">
            <button onClick={onClose}>
              <Image
                src="/images/buttons/back-button-left.svg"
                height={48}
                width={48}
                alt="Back button"
              />
            </button>
          </div>
          <div>
            <h1 className="text-2xl leading-7 openSansFont font-bold uppercase py-6">
              Edit Template
            </h1>
          </div>
        </div>

        {/* Template Name */}
        <div className="w-full">
          <h1 className="text-lg mb-2 text-stone-500">Template Name</h1>
          <input
            type="text"
            id="templateName"
            maxLength={50}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter a name for your template"
            className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
          />
          {errorMessage && (
            <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}
          {updateTemplateError && (
            <p className="text-red-500 text-center mt-2">
              {updateTemplateError}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <motion.div layout>
          {toggleSearchBar && (
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full bg-gray-50 left-0 right-0 flex flex-col border rounded shadow-lg z-10 overflow-y-auto max-h-48"
                >
                  {searchResults.map((exercise: Exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => handleSelectExercise(exercise)}
                      className="cursor-pointer p-2 border-b hover:bg-orange-500 hover:text-white"
                    >
                      {exercise.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Exercise Table */}
        <div className="w-full overflow-y-auto">
          {selectedExercises.map((exercise, eIdx) => (
            <motion.div
              key={eIdx}
              className={`text-center flex justify-between ${
                eIdx % 2 === 0 ? "lightTanOrange" : "bg-white"
              }`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: eIdx * 0.1 }}
            >
              <div className="flex justify-between w-full items-center pl-2">
                <div className="p-1">
                  {ExercisesDictionary[exercise.exerciseName as ExerciseEnum]
                    ?.label || exercise.exerciseName}
                </div>
                <div className="flex gap-2 items-center mr-2">
                  <input
                    type="number"
                    value={exercise.sets.length}
                    onChange={(e) =>
                      handleSetNumberChange(eIdx, Number(e.target.value))
                    }
                    className="mb-2 mt-2 p-1 border rounded-xl text-center w-12"
                  />
                  <p> set(s)</p>
                </div>
              </div>

              <div className="flex pr-2 items-center">
                <button onClick={() => handleDeleteExercise(eIdx)}>
                  <FiMinusCircle className="text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
          {!toggleSearchBar && (
            <div>
              <button
                onClick={() => setToggleSearchBar(true)}
                className="flex gap-1 items-center p-2 hover:scale-110 transition ease-in-out duration-100"
              >
                <FiPlus style={{ color: "#03BB9B" }} />
                <p className="text-sm font-bold" style={{ color: "#03BB9B" }}>
                  Add Exercise
                </p>
              </button>
            </div>
          )}
        </div>

        <motion.div
          className="flex self-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: selectedExercises.length * 0.1 }}
        >
          <BasicRoundedButton
            label="Save"
            onClick={handleSave}
            buttonClassNames="defaultButtonColor"
          />
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default EditTemplateModal;
