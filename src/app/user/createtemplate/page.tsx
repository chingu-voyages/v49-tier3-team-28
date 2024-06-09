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
import AddIcon from "@mui/icons-material/Add";
import { Divider, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
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

  const handleSelectExercise = (exercise: Exercise) => {
    const newExercise: ExerciseActivity = {
      exerciseName: exercise.label,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit }],
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
    if (!templateName || templateName.trim() === "") {
      setErrorMessage("Template name can't be empty.");
      return;
    }

    if (session?.user?._id) {
      const logData = [
        {
          name: templateName.trim(),
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
        setErrorMessage("");
        await LoggingClient.saveLog({
          logs: logData,
        });
      } catch (error: any) {
        setErrorMessage(error.message);
        return;
      }
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col justify-center w-screen mt-8 mb-10 p-4">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold futuraFont uppercase self-center">
          Create a Workout Template
        </h1>
        <button>
          <FiX className="size-8 text-white blueGray rounded-full ml-2 p-2 hover:bg-stone-500" />
        </button>
      </div>

      <div className="flex mt-8">
        <h2 className="verdanaFont text-base">Give your template a name</h2>
      </div>

      <div className="mt-2">
        <input
          type="text"
          id="templateName"
          value={templateName}
          maxLength={50}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Template Name"
          className="p-2 bg-gray-50 w-full robotoFont h-16 text-xl hover:bg-neutral-300"
        />
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </div>
      <div className="mt-2">
        <Divider className="blueGray" />
      </div>
      <div className="mt-8">
        <h2 className="verdanaFont text-base">
          Search for exercises to add to your template
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative flex flex-col min-w-80 mt-4">
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
      <div className="mt-2">
        <Divider className="blueGray" />
      </div>
      {/* Selected Exercises (Exercise Log) */}
      <div className="flex flex-col mt-8">
        {selectedExercises.length > 0 && (
          <div className="flex justify-end gap-2 w-full mb-1">
            <ColorToggleButton
              onChange={toggleUnit}
              alignment={unit}
              leftLabel="Metric"
              rightLabel="Imperial"
              leftValue="lbs"
              rightValue="kg"
            />
          </div>
        )}
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
            <IconButton onClick={() => handleAddSet(index)}>
              <AddIcon sx={{ color: "#03BB9B" }} />
              <p className="text-sm font-bold" style={{ color: "#03BB9B" }}>
                Set
              </p>
            </IconButton>
          </div>
        ))}
      </div>
      {/* Save Button */}
      <div className="flex justify-center gap-y-9 mt-8">
        <BasicRoundedButton
          onClick={handleSaveLog}
          label="Save Template"
          buttonClassNames="defaultButtonColor"
          disabled={
            selectedExercises.length === 0 ||
            !templateName ||
            templateName.trim() === ""
          }
        ></BasicRoundedButton>
      </div>
      <SuccessModal open={isModalOpen} />
    </div>
  );
}
