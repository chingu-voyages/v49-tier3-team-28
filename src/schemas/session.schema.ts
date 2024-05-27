import { Session } from "@/models/session.model";
import mongoose, { Schema } from "mongoose";
import { ExerciseRepository } from "./exercise.schema";

const sessionSchema = new Schema<Session>(
  {
    exercises: {
      type: [ExerciseRepository],
      required: true,
    },
  },
  { timestamps: true }
)


export const SetRepository: mongoose.Model<Session> =
  mongoose.models.Set || mongoose.model("Set", sessionSchema);