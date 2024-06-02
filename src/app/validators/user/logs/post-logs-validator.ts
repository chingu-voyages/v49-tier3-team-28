import { array, boolean, number, object, string } from "yup";

export const postLogsValidator = object({
  logs: array().of(
    object({
      exerciseName: array().of(
        object({
          exerciseName: string().required(),
          sets: array().of(
            object({
              setNumber: number().required(),
              weight: number().required(),
              unit: string().required(),
              reps: number().required(),
            })
          ),
        })
      ),
      isTemplate: boolean().optional(),
      name: string().optional(),
    })
  ),
});
