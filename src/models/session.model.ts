import { Exercise } from "./exercise.model";

export interface Session {
  createdAt: Date;
  exercises: Exercise[];
}
