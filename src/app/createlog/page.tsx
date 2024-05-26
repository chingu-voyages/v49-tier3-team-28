"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moduleStyles from "../home-page.module.css";

export default function CreateLog() {
  const { status } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  // State for search input, search results, and selected exercises
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Convert ExercisesDictionary to an array
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

  // Function to handle selecting an exercise
  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prev) => [...prev, exercise]);
    setSearchInput(""); // Clear search input after selection
    setSearchResults([]); // Clear search results after selection
  };

  // Users who are not authenticated will be redirected to the sign in page.
  if (status === "unauthenticated") {
    router.replace("/signin");
    return null; // Ensure the component does not render until redirection
  }

  return (
    <div className="flex flex-col items-center gap-y-10 justify-center w-screen h-screen bg-cover bg-no-repeat bg-center">
      {/* Header */}
      <div className="flex flex-col gap-y-10">
        <h1 className={` ${moduleStyles.titleLogo} text-5xl leading-6`}>
          Log Your Workout
        </h1>
        <h3>Start searching and build your log.</h3>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for an exercise"
          className="border rounded p-2"
        />
        <div
          className="flex flex-col gap-y-2 border rounded p-2"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {searchResults.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => handleSelectExercise(exercise)}
              className="cursor-pointer p-2 border-b"
            >
              {exercise.label}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Exercises */}
      <div className="flex flex-col gap-y-9">
        <h3>Selected Exercises:</h3>
        {selectedExercises.map((exercise) => (
          <div key={exercise.id} className="p-2 border rounded">
            {exercise.label}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex flex-col gap-y-9">
        <Link href="/home">
          <BasicRoundedButton label="Save Your Log" />
        </Link>
      </div>
    </div>
  );
}
