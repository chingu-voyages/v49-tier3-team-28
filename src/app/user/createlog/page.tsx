"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { ColorToggleButton } from "@/components/buttons/unit-toggle-button/Unit-toggle-button";
import SaveLogModal from "@/components/modals/SaveLogModal";
import TemplatesModal from "@/components/modals/TemplatesModal";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Set } from "@/models/set.model";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiTrash, FiX } from "react-icons/fi";
import { LoggingClient } from "../../clients/logging-client/logging-client";

const convertWeight = (weight: number, unit: string) => {
  const conversionRate = 2.20462;
  if (unit === "kg") {
    return weight / conversionRate;
  } else {
    return weight * conversionRate;
  }
};

export default function CreateLog() {
  const { status, session } = useAuthSession(); // status, session and update are available, see auth-context.tsx

  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null; // Ensure the component does not render until redirection
  }

  // let templateData = mockData.logs[0].exercises;
  // console.log(mockData.logs[0].exercises);

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseActivity[]
  >([]);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [unit, setUnit] = useState<string>("lbs");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] =
    useState<boolean>(false);
  let isTemplate = false;

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

  // Adds an exercise to the log when selected from the search bar
  const handleSelectExercise = (exercise: Exercise): ExerciseActivity => {
    const newExercise: ExerciseActivity = {
      exerciseName: exercise.label,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit }],
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setSearchInput(""); // Clear search input after selection
    setSearchResults([]); // Clear search results after selection

    return newExercise;
  };

  // Adds a set to a selected exercise
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

  // Updates the set values
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

  // Deletes a set from a selected exercise
  const handleDeleteSet = (index: number, setIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    // Remove the set at setIndex from the selected exercise
    newSelectedExercises[index].sets.splice(setIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  // Deletes an exercise from the log
  const handleDeleteExercise = (index: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.splice(index, 1);
    setSelectedExercises(newSelectedExercises);
  };

  // Handles toggle logic that switches between lbs and kg
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenTemplateModal = () => {
    setIsTemplateModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  const handleSaveLog = async () => {
    if (session?.user?._id) {
      const logData = [
        {
          date: new Date(),
          name: isTemplate ? "Template" : new Date(),
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

      console.log(session.user);

      await LoggingClient.saveLog({
        userId: session.user._id,
        logs: logData,
      });
    }
    setIsModalOpen(false);
    isTemplate = false;
  };

  const handleTemplateSelection = async (templateData) => {
    await setSelectedTemplateData(templateData.exercises);
  };

  const handleSetTemplates = () => {
    setSelectedExercises(selectedTemplateData);
    setIsTemplateModalOpen(false);
  };

  const handleSaveAsTemplate = async () => {
    isTemplate = true;
    handleSaveLog();
  };

  return (
    <div className="flex flex-col items-center gap-y-20 justify-center w-screen mt-20 mb-10">
      {/* Header */}
      <h1 className="text-5xl font-bold leading-6 text-center">
        Log Your Workout
      </h1>
      <BasicRoundedButton
        label="Choose From Templates"
        onClick={handleOpenTemplateModal}
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
            <h4 className="text-black font-bold p-2 text-center ">
              {exercise.exerciseName}
            </h4>
            <button
              onClick={() => handleDeleteExercise(index)}
              className="absolute top-2 right-2"
            >
              <FiX />
            </button>
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
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex} className="odd:bg-orange-100 text-center">
                    <td className="p-2 text-center">{setIndex + 1}</td>
                    <td className="p-2 text-center ">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetChange(
                            index,
                            setIndex,
                            "reps",
                            Number(e.target.value)
                          )
                        }
                        className="w-3/4 p-1 border rounded-xl text-center bg-gray-50"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          handleSetChange(
                            index,
                            setIndex,
                            "weight",
                            Number(e.target.value)
                          )
                        }
                        className="w-3/4 p-1 border rounded-xl text-center bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      {exercise.sets.length > 1 && ( // Condition to render the delete button
                        <button
                          onClick={() => handleDeleteSet(index, setIndex)}
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
          onClick={handleOpenModal}
          label="Save Your Log"
          disabled={selectedExercises.length === 0}
        ></BasicRoundedButton>
      </div>
      <SaveLogModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSaveLog}
        onSecondaryAction={handleSaveAsTemplate}
      />
      <TemplatesModal
        open={isTemplateModalOpen}
        onClose={handleCloseTemplateModal}
        onTemplateSelect={handleTemplateSelection}
        onGenerate={handleSetTemplates}
      />
    </div>
  );
}
