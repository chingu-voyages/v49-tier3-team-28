import { Exercise } from "./exercise.model";

export interface Log {
  createdAt: Date;
  exercises: Exercise[];
  isTemplate: boolean;
}
