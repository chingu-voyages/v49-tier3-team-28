"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import SuccessModal from "@/components/modals/SuccessModal";
import { TemplateExerciseTable } from "@/components/tables/TemplateExerciseTable";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Exercise } from "@/lib/exercises/exercise";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Set } from "@/models/set.model";
import { CircularProgress, Divider } from "@mui/material";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { LoggingClient } from "../../clients/logging-client/logging-client";

type ExerciseActivityWithId = ExerciseActivity & { id: string };

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
    ExerciseActivityWithId[]
  >([]);

  const [unit, setUnit] = useState<string>("lbs");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isBusy, setIsBusy] = useState<boolean>(false);

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
    const newExercise: ExerciseActivityWithId = {
      exerciseName: exercise.label,
      sets: [{ setNumber: 1, reps: 0, weight: 0, unit }],
      id: new mongoose.Types.ObjectId().toString(),
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setSearchInput("");
    setSearchResults([]);
  };

  const handleDeleteExercise = (id: string) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSetCountUpdate = (id: string, setCount: number) => {
    setSelectedExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === id) {
          return {
            ...ex,
            sets: createEmptyTemplateSet(setCount),
          };
        }
        return ex;
      })
    );
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
        setIsBusy(true);
        setErrorMessage("");
        await LoggingClient.saveLog({
          logs: logData,
        });
      } catch (error: any) {
        setErrorMessage(error.message);
        return;
      } finally {
        setIsBusy(false);
      }
    }
    setIsModalOpen(true);
  };

  return (
    <motion.div
      className="flex flex-col justify-center w-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex gap-8">
        <div className="self-center cursor-pointer">
          <Link href="/user/mytemplates">
            <Image
              src="/images/buttons/back-button-left.svg"
              height={48}
              width={48}
              alt="Back button"
            />
          </Link>
        </div>
        <div>
          <h1 className="text-2xl leading-7 openSansFont font-bold uppercase py-6">
            Create a Template
          </h1>
        </div>
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
          <motion.p
            className="text-red-500 text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {errorMessage}
          </motion.p>
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
      <div className="mt-2">
        <Divider className="blueGray" />
      </div>
      {/* Selected Exercises (Exercise Log) */}
      <LayoutGroup>
        <>
          <div className="flex flex-col mt-8">
            <AnimatePresence>
              {selectedExercises.map((exercise) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl mb-4 border border-gray-100 shadow-md relative"
                  exit={{ opacity: 0, position: "relative", x: "-100vw" }}
                  key={exercise.id}
                >
                  <TemplateExerciseTable
                    exerciseActivity={exercise}
                    onDeleteExercise={handleDeleteExercise}
                    onSetCountChange={handleSetCountUpdate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Save Button */}
          <motion.div layout className="flex justify-center gap-y-9 mt-8">
            <BasicRoundedButton
              onClick={handleSaveLog}
              label="Save Template"
              buttonClassNames="defaultButtonColor !justify-evenly"
              disabled={
                selectedExercises.length === 0 ||
                !templateName ||
                templateName.trim() === "" ||
                isBusy
              }
            >
              {isBusy && <CircularProgress size={30} sx={{ color: "white" }} />}
            </BasicRoundedButton>
          </motion.div>
        </>
      </LayoutGroup>
      <SuccessModal open={isModalOpen} />
    </motion.div>
  );
}

const createEmptyTemplateSet = (numberOfSets: number): Set[] => {
  const sets = [];
  for (let i = 0; i < numberOfSets; i++) {
    sets.push({ setNumber: i + 1, reps: 0, weight: 0, unit: "lbs" });
  }
  return sets;
};
