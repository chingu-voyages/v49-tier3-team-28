import { ExerciseActivity } from "./exercise-activity.model";

export interface Log {
  createdAt: Date;
  name: string;
  exercises: ExerciseActivity[];
  isTemplate: boolean;
}
