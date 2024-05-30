import { ExerciseActivity } from "./exercise-activity.model";

export interface Log {
  createdAt: Date;
  exercises: ExerciseActivity[];
  isTemplate: boolean;
}
