"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch, FiTrash, FiX } from "react-icons/fi"; // Importing the search and clear icons

export default function CreateLog() {
  const { status, session } = useAuthSession(); // status, session and update are available, see auth-context.tsx
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

  const handleDeleteExercise = (index) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.splice(index, 1);
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
      <div className="flex flex-col gap-y-10 text-center">
        <h1 className="text-5xl font-bold leading-6">Log Your Workout</h1>
        <h3 className="text-2xl">Start searching and build your log.</h3>
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
            {searchResults.map((exercise) => (
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

      {/* Selected Exercises */}
      <div className="flex flex-col gap-y-9 w-3/4 px-4">
        {/* <h3>Selected Exercises:</h3> */}
        {selectedExercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="rounded-xl mb-4 border border-gray-100 text-center shadow-md relative"
          >
            <h4 className="text-black font-bold p-2">{exercise.label}</h4>
            <button
              onClick={() => handleDeleteExercise(index)}
              className="absolute top-2 right-2"
            >
              <FiX />
            </button>
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="text-white bg-orange-500">
                  <th className="p-left-2 font-bold">Set</th>
                  <th className="p-2">Reps</th>
                  <th className="p-2">Weight (lbs)</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex} className="odd:bg-orange-100">
                    <td className="p-2 text-center">{setIndex + 1}</td>
                    <td className="p-2">
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
                            e.target.value
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
              className="mt-2 mb-2 p-2 border rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600"
            >
              + Add Set
            </button>
          </div>
        ))}
      </div>
      {/* Save Button */}
      <div className="flex flex-col gap-y-9">
        <BasicRoundedButton
          onClick={handleSaveLog}
          label="Save Your Log"
          disabled={selectedExercises.length === 0}
        ></BasicRoundedButton>
      </div>
    </div>
  );
}
