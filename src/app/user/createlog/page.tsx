"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { ColorToggleButton } from "@/components/buttons/unit-toggle-button/Unit-toggle-button";
import ContinueDraftModal from "@/components/modals/ContinueDraftModal";
import SaveDraftModal from "@/components/modals/SaveDraftModal"; // Import the new modal
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
import { CircularProgress, IconButton } from "@mui/material";
import { motion } from "framer-motion";
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

  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] =
    useState<boolean>(false); // State for Save Draft modal
  const [isContinueDraftModalOpen, setIsContinueDraftModalOpen] =
    useState<boolean>(false); // State for Save Draft modal

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

    if (searchInput.length > 0 || selectedExercises.length > 0) {
      setIsUserSearching(true);
    } else {
      setIsUserSearching(false);
    }
  }, [searchInput]);

  // Updates the state of the unit or exercises based on localStorage
  useEffect(() => {
    // Updates unit from localStorage
    const savedUnit = localStorage.getItem("weightUnit");
    if (savedUnit) {
      setUnit(savedUnit);
    }

    // Updates exercises from localStorage
    const savedExercises = JSON.parse(
      localStorage.getItem("selectedTemplate")! //Checks from template selection
    );
    if (savedExercises) {
      setSelectedExercises(savedExercises);
    } else {
      const draft = JSON.parse(localStorage.getItem("draft")!); // Check for saved draft
      !draft
        ? setIsContinueDraftModalOpen(false)
        : setIsContinueDraftModalOpen(true);
    }

    localStorage.removeItem("selectedTemplate");
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

  // ---------------------------- Handle Save Draft -------------------------------------

  const handleSaveDraft = () => {
    localStorage.setItem("draft", JSON.stringify(selectedExercises));
    router.push("/user/home");
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

  if (status === "loading")
    return (
      <div className="flex justify-center" style={{ marginTop: "40%" }}>
        <CircularProgress />
      </div>
    );

  return (
    <div className="flex flex-col gap-y-10 justify-center w-screen mt-4 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between"
      >
        <h1 className="text-2xl font-bold openSansFont uppercase self-center">
          Log Your Workout
        </h1>
        <button
          onClick={() =>
            selectedExercises.length > 0
              ? setIsSaveDraftModalOpen(true)
              : router.push("/user/home")
          }
        >
          <FiX className="size-12 text-white blueGray rounded-full ml-2 p-2 hover:bg-stone-500" />
        </button>
      </motion.div>
      {!isUserSearching && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="self-center"
        >
          <BasicRoundedButton
            buttonClassNames="self-center defaultButtonColor"
            label="Choose From Templates"
            onClick={() => setIsTemplateModalOpen(true)}
          />
        </motion.div>
      )}

      {!isUserSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="flex-1 w-48 border-t-2"></div>
          <h2 className="text-sm text-gray-500 pl-2 pr-2 verdanaFont">
            Or start Logging by Search
          </h2>
          <div className="flex-1 w-48 border-t-2"></div>
        </motion.div>
      )}

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative flex flex-col min-w-80"
      >
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full bg-gray-50 left-0 right-0 flex flex-col border rounded shadow-lg z-10"
            style={{ overflowY: "auto", maxHeight: "200px" }}
          >
            {searchResults.map((exercise: Exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleSelectExercise(exercise)}
                className="cursor-pointer p-2 border-b hover:bg-orange-500 hover:text-white robotoFont"
              >
                {exercise.label}
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
      {selectedExercises.length > 0 && (
        <>
          <div className="flex flex-col gap-y-9 w-full px-4">
            <div className="flex justify-end gap-2 w-full">
              <ColorToggleButton
                onChange={toggleUnit}
                alignment={unit}
                leftLabel="Imperial"
                rightLabel="Metric"
                leftValue="lbs"
                rightValue="kg"
              />
            </div>

            {selectedExercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-y-9"
          >
            <BasicRoundedButton
              onClick={() => handleSaveLog()}
              buttonClassNames="self-center defaultButtonColor"
              label="Save Log"
              disabled={selectedExercises.length === 0}
            ></BasicRoundedButton>
          </motion.div>
        </>
      )}
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
      <SaveDraftModal
        open={isSaveDraftModalOpen}
        onClose={() => {
          setIsSaveDraftModalOpen(false);
        }}
        onSaveDraft={handleSaveDraft}
      />
      <ContinueDraftModal
        open={isContinueDraftModalOpen}
        onClose={() => {
          setIsContinueDraftModalOpen(false);
          if (localStorage.getItem("draft")) {
            localStorage.removeItem("draft");
          }
        }}
        onContinueDraft={() => {
          setSelectedExercises(JSON.parse(localStorage.getItem("draft")!));
          setIsContinueDraftModalOpen(false);
        }}
      />
    </div>
  );
}
