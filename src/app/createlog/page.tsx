"use client";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moduleStyles from "../home-page.module.css";

export default function CreateLog() {
  const { status, session } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  console.log(session);
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

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

  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prev) => [
      ...prev,
      { ...exercise, sets: [{ reps: 0, weight: 0 }] },
    ]);
    setSearchInput(""); // Clear search input after selection
    setSearchResults([]); // Clear search results after selection
  };

  const handleAddSet = (index) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[index].sets.push({ reps: 0, weight: 0 });
    setSelectedExercises(newSelectedExercises);
  };

  const handleSetChange = (index, setIndex, field, value) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[index].sets[setIndex][field] = value;
    setSelectedExercises(newSelectedExercises);
  };

  const handleDeleteSet = (index, setIndex) => {
    const newSelectedExercises = [...selectedExercises];
    // Remove the set at setIndex from the selected exercise
    newSelectedExercises[index].sets.splice(setIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  const handleSaveLog = async () => {
    // Create sessions array
    const sessions = [
      {
        date: new Date(), // Use current date as an example
        exercises: selectedExercises.map((exercise) => {
          // Map selected exercises to exerciseSchema
          return {
            exerciseName: exercise.label,
            sets: exercise.sets.map((set, index) => {
              // Map sets to setSchema
              return {
                setNumber: index + 1, // Set number starts from 1
                weight: set.weight,
                unit: "lbs", // Assuming the default unit is pounds
                reps: set.reps,
              };
            }),
          };
        }),
      },
    ];

    const formData = {
      userId: session?.user?._id,
      sessions: sessions,
    };

    const jsonData = JSON.stringify(formData);
    console.log(jsonData);

    try {
      // Send a POST request to your backend API endpoint
      const response = await fetch("/api/logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      // Check if the request was successful
      if (response.ok) {
        console.log("Log saved successfully!");
      } else {
        console.error("Failed to save log:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while saving the log:", error);
    }
  };

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
      <div className="flex flex-col gap-y-9 w-full px-4">
        <h3>Selected Exercises:</h3>
        {selectedExercises.map((exercise, index) => (
          <div key={exercise.id} className="p-2 border rounded mb-4">
            <h4>{exercise.label}</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Set</th>
                  <th className="border p-2">Reps</th>
                  <th className="border p-2">Weight (lbs)</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex}>
                    <td className="border p-2 text-center">{setIndex + 1}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetChange(
                            index,
                            setIndex,
                            "reps",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          handleSetChange(
                            index,
                            setIndex,
                            "weight",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    {exercise.sets.length > 1 && ( // Condition to render the delete button
                      <td className="border p-2">
                        <button
                          onClick={() => handleDeleteSet(index, setIndex)}
                          className="p-1 border rounded bg-red-500 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => handleAddSet(index)}
              className="mt-2 p-2 border rounded bg-blue-500 text-white"
            >
              Add Set
            </button>
          </div>
        ))}
      </div>
      {/* Save Button */}
      <div className="flex flex-col gap-y-9">
        <button
          onClick={handleSaveLog}
          className="p-2 border rounded bg-green-500 text-white"
        >
          Save Your Log
        </button>
      </div>
    </div>
  );
}
