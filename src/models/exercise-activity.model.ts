import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { Set } from "./set.model";

export interface ExerciseActivity {
  exerciseName: ExerciseEnum | string;
  sets: Set[];
}
