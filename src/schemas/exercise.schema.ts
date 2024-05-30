import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Schema } from "mongoose";
import { setSchema } from "./set.schema";

export const exerciseSchema = new Schema<ExerciseActivity>({
  exerciseName: {
    type: String,
    required: true,
    unique: true,
  },
  sets: {
    type: [setSchema],
    required: true,
  },
});
