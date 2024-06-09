import { Set } from "@/models/set.model";
import { Schema } from "mongoose";

export const setSchema = new Schema<Set>({
  setNumber: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
});
