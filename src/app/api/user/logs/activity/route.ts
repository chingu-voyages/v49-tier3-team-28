// This route gets all of the user's logs specific for some exercise they are querying
// ex. api/user/logs/activity?exerciseName=pushups

import authOptions from "@/app/api/auth/auth-options";
import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import dbConnect from "@/lib/mongodb/mongodb";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { UserRepository } from "@/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface ExerciseActivityResponse extends ExerciseActivity {
  createdAt?: Date;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // For the search params, we expecting the exercise name (the enum)
  const { searchParams } = new URL(req.url);
  const exerciseName = searchParams.get("exerciseName");

  if (!exerciseName)
    return NextResponse.json(
      { error: "Invalid exercise name" },
      { status: 400 }
    );

  await dbConnect();
  const user = await UserRepository.findById(session.user?._id);
  if (user) {
    const responseData = user.logs.reduce(
      (acc: ExerciseActivityResponse[], currentLog: Log) => {
        if (
          currentLog.exercises.some(
            (ex) =>
              ex.exerciseName === exerciseName ||
              ex.exerciseName ===
                ExercisesDictionary[exerciseName as ExerciseEnum].label
          )
        ) {
          acc = acc.concat(
            currentLog.exercises
              .filter(
                (e) =>
                  e.exerciseName === exerciseName ||
                  e.exerciseName ===
                    ExercisesDictionary[exerciseName as ExerciseEnum].label
              )
              .map((e) => ({
                exerciseName: e.exerciseName,
                sets: e.sets,
                createdAt: currentLog.createdAt,
              }))
          );
        }
        return acc;
      },
      []
    );

    return NextResponse.json(responseData, { status: 200 });
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
