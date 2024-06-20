import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExerciseActivity } from "@/models/exercise-activity.model";

export const ExercisesClient = {
  async getActivitiesByExerciseName(
    exerciseName: ExerciseEnum
  ): Promise<ExerciseActivity[]> {
    const response = await fetch(
      `/api/user/logs/activity?exerciseName=${exerciseName}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch activities for ${exerciseName}`);
    }
    return response.json() as Promise<ExerciseActivity[]>;
  },
};
