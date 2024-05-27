import { Exercise } from "@/models/exercise.model";
import mongoose, { Schema } from "mongoose";
import { SetRepository } from "./set.schema";

const exerciseSchema = new Schema<Exercise>({
  exerciseName: {
    type: String,
    required: true,
    unique: true,
  },
  sets: {
    type: [SetRepository],
    required: true,
  }
})


export const ExerciseRepository: mongoose.Model<Exercise> =
  mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);