import { BodyPartEnum } from "./body-parts";
import { ExerciseEnum } from "./exercise-enum";

// The structure of an exercise object
export interface Exercise {
  id: number;
  name: ExerciseEnum | string;
  label: string;
  bodyPart: BodyPartEnum;
}
