"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { ColorToggleButton } from "@/components/buttons/unit-toggle-button/Unit-toggle-button";
import SuccessModal from "@/components/modals/SuccessModal";
import ExerciseTable from "@/components/tables/ExerciseTable";
import { convertWeight } from "@/helpers/helpers";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { LoggingClient } from "../../clients/logging-client/logging-client";

// TODO: Need to create a redirect route when successfully saving the template

export default function CreateTemplate() {
  const { status, session } = useAuthSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null;
  }

  // ---------------------------- State Management ------------------------------------

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseActivity[]
  >([]);
  const [unit, setUnit] = useState<string>("lbs");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const exercisesArray = Object.values(ExercisesDictionary);

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

  useEffect(() => {
    const savedUnit = localStorage.getItem("weightUnit");
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  // ------------------ Add, Delete, Update Exercises ----------------------------------

  const handleSelectExercise = (exercise: Exercise): ExerciseActivity => {
    const newExercise: ExerciseActivity = {
      exerciseName: exercise.label,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit }],
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

  // ---------------------  Add, Delete, Update Sets ------------------------------------

  const handleAddSet = (index: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[index].sets.push({
      setNumber: 1,
      reps: 0,
      weight: 0,
      unit,
    });
    setSelectedExercises(newSelectedExercises);
  };

  const handleDeleteSet = (index: number, setIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[index].sets.splice(setIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  // ----------------------------- Toggle Units ----------------------------------------

  const toggleUnit = () => {
    const newUnit = unit === "lbs" ? "kg" : "lbs";
    const convertedExercises = selectedExercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        ...set,
        weight: parseInt(convertWeight(set.weight, newUnit).toFixed()),
      })),
    }));

    setSelectedExercises(convertedExercises);
    setUnit(newUnit);

    localStorage.setItem("weightUnit", newUnit);
  };

  // -------------------------- Save Log/Template ---------------------------------------

  const handleSaveLog = async () => {
    if (!templateName) {
      setErrorMessage("Template name can't be empty.");
      return;
    }

    if (session?.user?._id) {
      const logData = [
        {
          name: templateName,
          exercises: selectedExercises.map((exerciseActivity) => {
            return {
              exerciseName: exerciseActivity.exerciseName,
              sets: exerciseActivity.sets.map((set, index) => {
                return {
                  setNumber: index + 1,
                  weight: set.weight,
                  unit: unit,
                  reps: set.reps,
                };
              }),
            };
          }),
          isTemplate: true,
        },
      ];

      try {
        await LoggingClient.saveLog({
          logs: logData,
        });
      } catch (error: any) {
        //TODO: we need some UI feedback to show the user that the log was not saved
        console.error("Error saving log: ", error.message);
      }
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center gap-y-20 justify-center w-screen mt-20 mb-10">
      {/* Header */}
      <h1 className="text-5xl font-bold leading-6 text-center">
        Create a Workout Template
      </h1>

      <div className="flex items-center">
        <div className="flex-1 w-48 border-t-2"></div>
        <h2 className="text-xl text-gray-500 pl-2 pr-2">
          Start by giving your template a name
        </h2>
        <div className="flex-1 w-48 border-t-2"></div>
      </div>

      <div className="px-4 items-center w-1/2">
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

      <div className="flex items-center">
        <div className="flex-1 w-48 border-t-2"></div>
        <h2 className="text-xl text-gray-500 pl-2 pr-2">
          Search for exercises to add to your template
        </h2>
        <div className="flex-1 w-48 border-t-2"></div>
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

      {/* Selected Exercises (Exercise Log) */}
      <div className="flex flex-col gap-y-9 w-3/4 px-4">
        <div className="flex justify-end gap-2 w-full">
          <ColorToggleButton
            onChange={toggleUnit}
            alignment={unit}
            leftLabel="Metric"
            rightLabel="Imperial"
            leftValue="lbs"
            rightValue="kg"
          />
        </div>
        {selectedExercises.map((exercise, index) => (
          <div
            key={index}
            className="rounded-xl mb-4 border border-gray-100 shadow-md relative"
          >
            <ExerciseTable
              exerciseName={exercise.exerciseName}
              sets={exercise.sets}
              unit={unit}
              onDeleteSet={(setIndex) => handleDeleteSet(index, setIndex)}
              onDeleteExercise={() => handleDeleteExercise(index)}
              onSetChange={() => {}}
              idx={index}
            />

            <button
              onClick={() => handleAddSet(index)}
              className="m-2 p-2 border rounded-xl bg-green-500 text-white font-bold hover:bg-green-600"
            >
              <FiPlus />
            </button>
          </div>
        ))}
      </div>
      {/* Save Button */}
      <div className="flex flex-col gap-y-9">
        <BasicRoundedButton
          onClick={handleSaveLog}
          label="Save Template"
          disabled={selectedExercises.length === 0}
        ></BasicRoundedButton>
      </div>
      <SuccessModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
