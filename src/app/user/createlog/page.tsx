"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { ColorToggleButton } from "@/components/buttons/unit-toggle-button/Unit-toggle-button";
import SaveLogModal from "@/components/modals/SaveLogModal";
import TemplatesModal from "@/components/modals/TemplatesModal";
import ExerciseTable from "@/components/tables/ExerciseTable";
import { convertWeight } from "@/helpers/helpers";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Set } from "@/models/set.model";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { LoggingClient } from "../../clients/logging-client/logging-client";

export default function CreateLog() {
  const { status, session } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null; // Ensure the component does not render until redirection
  }

  // ---------------------------- State Management ------------------------------------

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseActivity[]
  >([]);
  const [selectedTemplateData, setSelectedTemplateData] = useState<
    ExerciseActivity[] | null
  >(null);
  const [unit, setUnit] = useState<string>("lbs");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] =
    useState<boolean>(false);

  const exercisesArray = Object.values(ExercisesDictionary);

  // Updates the search results as the user inputs characters in the search bar
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

  // Updates the state of the unit based on localStorage
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

  const handleSetChange = (
    index: number,
    setIndex: number,
    field: keyof Set,
    value: number
  ) => {
    const newSelectedExercises = [...selectedExercises];
    if (field == "reps" || field == "weight") {
      newSelectedExercises[index].sets[setIndex][field] = value;
      setSelectedExercises(newSelectedExercises);
    }
  };

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
    // Remove the set at setIndex from the selected exercise
    newSelectedExercises[index].sets.splice(setIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  // -------------- Set Template Data from Modal to Generate Logs ----------------------

  const handleTemplateSelection = (templateData: ExerciseActivity[] | null) => {
    setSelectedTemplateData(templateData);
  };

  const handleSetTemplates = () => {
    if (selectedTemplateData) {
      setSelectedExercises(selectedTemplateData);
    }
    setIsTemplateModalOpen(false);
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

  const handleSaveLog = async (isTemplate: boolean = false) => {
    if (session?.user?._id) {
      const logData = [
        {
          exercises: selectedExercises.map((exerciseActivity) => {
            // Map selected exercises to exerciseSchema
            return {
              exerciseName: exerciseActivity.exerciseName,
              sets: exerciseActivity.sets.map((set, index) => {
                // Map sets to setSchema
                return {
                  setNumber: index + 1, // Set number starts from 1
                  weight: set.weight,
                  unit: unit,
                  reps: set.reps,
                };
              }),
            };
          }),
          isTemplate: isTemplate,
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
        Log Your Workout
      </h1>
      <BasicRoundedButton
        label="Choose From Templates"
        onClick={() => setIsTemplateModalOpen(true)}
      />
      <div className="flex items-center">
        <div className="flex-1 w-48 border-t-2"></div>
        <h2 className="text-xl text-gray-500 pl-2 pr-2">
          Or Start Logging By Search
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
          <div
            className="absolute top-full bg-gray-50 left-0 right-0 flex flex-col border rounded shadow-lg z-10"
            style={{ overflowY: "auto", maxHeight: "200px" }}
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
          </div>
        )}
      </div>

      {/* Selected Exercises (Exercise Log) */}
      <div className="flex flex-col gap-y-9 w-full px-4">
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
              idx={index}
              sets={exercise.sets}
              unit={unit}
              onSetChange={(setIndex, field, value) =>
                handleSetChange(index, setIndex, field, value)
              }
              onDeleteSet={(setIndex) => handleDeleteSet(index, setIndex)}
              onDeleteExercise={() => handleDeleteExercise(index)}
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
      <div className="flex flex-col gap-y-9">
        <BasicRoundedButton
          onClick={() => handleSaveLog()}
          label="Save Log"
          disabled={selectedExercises.length === 0}
        ></BasicRoundedButton>
      </div>
      <SaveLogModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedExercises}
      />
      <TemplatesModal
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onTemplateSelect={handleTemplateSelection}
        onGenerate={handleSetTemplates}
      />
    </div>
  );
}
