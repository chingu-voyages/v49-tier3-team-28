import { ExerciseActivity } from "./exercise-activity.model";

export interface Log {
  name?: string;
  exercises: ExerciseActivity[];
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
