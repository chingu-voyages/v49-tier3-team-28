import { Log } from "@/models/log.model";
import mongoose, { Schema } from "mongoose";
import { exerciseSchema } from "./exercise.schema";
import { boolean } from "yup";

export const logSchema = new Schema<Log>(
  {
    exercises: {
      type: [exerciseSchema],
      required: true,
    },
    isTemplate: {
      type: Boolean,
    }
  },
  { timestamps: true }
)
