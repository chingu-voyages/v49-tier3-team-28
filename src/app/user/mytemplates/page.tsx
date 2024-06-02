"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import TemplateCard from "@/components/cards/TemplateCard";
import React from "react";

interface MyTemplatesProps {}

//TODO: remove this mock data once we have backend support
let mockData = {
  userId: "665291224e3640a167a73ae5",
  logs: [
    {
      date: "2024-05-31T20:04:02.485Z",
      name: "Leg Day",
      exercises: [
        {
          exerciseName: "Walking Lunge",
          sets: [
            { setNumber: 1, weight: 0, unit: "lbs", reps: 8 },
            { setNumber: 2, weight: 2, unit: "lbs", reps: 0 },
          ],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 0, unit: "lbs", reps: 0 }],
        },
      ],
      isTemplate: true,
    },
    {
      date: "2024-05-31T20:04:02.485Z",
      name: "Back Day",
      exercises: [
        {
          exerciseName: "Walking Lunge",
          sets: [
            { setNumber: 1, weight: 3, unit: "lbs", reps: 8 },
            { setNumber: 2, weight: 2, unit: "lbs", reps: 4 },
          ],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
      ],
      isTemplate: true,
    },
    {
      date: "2024-05-31T20:04:02.485Z",
      name: "Template 2",
      exercises: [
        {
          exerciseName: "Walking Lunge",
          sets: [
            { setNumber: 1, weight: 3, unit: "lbs", reps: 8 },
            { setNumber: 2, weight: 2, unit: "lbs", reps: 4 },
          ],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
      ],
      isTemplate: true,
    },
    {
      date: "2024-05-31T20:04:02.485Z",
      name: "Shoulders",
      exercises: [
        {
          exerciseName: "Walking Lunge",
          sets: [
            { setNumber: 1, weight: 3, unit: "lbs", reps: 8 },
            { setNumber: 2, weight: 2, unit: "lbs", reps: 4 },
          ],
        },
        {
          exerciseName: "Lat Pulldown",
          sets: [{ setNumber: 1, weight: 1, unit: "lbs", reps: 12 }],
        },
      ],
      isTemplate: true,
    },
  ],
};

const MyTemplates: React.FC<MyTemplatesProps> = ({}) => {
  const templates = mockData.logs.filter((log) => log.isTemplate);
  //   const templates = null; Case for no template

  const handleClick = () => {
    console.log("Clicked this template");
  };

  return (
    <div>
      <div className="flex flex-col justify-evenly items-center text-center min-h-screen">
        <h1 className="text-4xl font-bold text-center">
          Choose From Templates
        </h1>
        {templates ? (
          <h1>Please choose one template to start:</h1>
        ) : (
          <h1> There are currently no templates. Create one below</h1>
        )}

        {/* Templates to Choose From */}
        <div className="flex flex-wrap -mx-2">
          {templates &&
            templates.map((template, index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <TemplateCard onClick={handleClick} data={template} />
              </div>
            ))}
        </div>
        <div className="flex flex-col justify-between h-28">
          <BasicRoundedButton label="Create New Template" />
        </div>
      </div>
    </div>
  );
};

export default MyTemplates;
