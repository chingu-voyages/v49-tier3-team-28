import { Exercise } from "@/models/exercise.model";
import mongoose, { Schema } from "mongoose";
import { setSchema } from "./set.schema";

export const exerciseSchema = new Schema<Exercise>({
  exerciseName: {
    type: String,
    required: true,
    unique: true,
  },
  sets: {
    type: [setSchema],
    required: true,
  }
})