import { ExerciseActivity } from "./exercise-activity.model";

export interface Log {
  _id?: string;
  name?: string;
  exercises: ExerciseActivity[];
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
