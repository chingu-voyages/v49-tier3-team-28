import { Log } from "@/models/log.model";
import { Schema } from "mongoose";
import { exerciseSchema } from "./exercise.schema";

export const logSchema = new Schema<Log>(
  {
    exercises: {
      type: [exerciseSchema],
      required: true,
    },
    isTemplate: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
