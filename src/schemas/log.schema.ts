import { Log } from "@/models/log.model";
import { Schema } from "mongoose";
import { exerciseActivitySchema } from "./exercise-activity.schema";

export const logSchema = new Schema<Log>(
  {
    exercises: {
      type: [exerciseActivitySchema],
      required: true,
    },
    isTemplate: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
