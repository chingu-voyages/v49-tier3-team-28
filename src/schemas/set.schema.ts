import { Set } from "@/models/set.model";
import mongoose, { Schema } from "mongoose";

const setSchema = new Schema<Set>({
  setNumber: {
    type: Number,
    required: true,
    unique: true,
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
  }
})


export const SetRepository: mongoose.Model<Set> =
  mongoose.models.Set || mongoose.model("Set", setSchema);