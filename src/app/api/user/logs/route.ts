import { postLogsValidator } from "@/app/validators/user/logs/post-logs-validator";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/auth-options";

export async function POST(req: NextRequest) {
  // This makes sure that the requestor has a session.
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // we have access to the user's mongodbId in the session
  const requestBody = await req.json();
  // validate the request body
  try {
    await postLogsValidator.validate(requestBody, { abortEarly: false });
  } catch (e: any) {
    return NextResponse.json(e, { status: 400 });
  }

  await dbConnect();

  const user = await UserRepository.findById(session.user?._id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  for (const log of requestBody.logs) {
    if (
      user.logs.some(
        (userLog) => userLog.name === log.name && userLog.isTemplate
      )
    ) {
      return NextResponse.json(
        {
          error: "Template name already exists. Please choose a unique name.",
        },
        { status: 400 }
      );
    }
  }
  user.logs = user.logs.concat(requestBody.logs);

  await user.save();
  return NextResponse.json(
    { message: "Logs saved successfully" },
    { status: 200 }
  );
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get the search parameters from the request. We're expect month and year.
  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month")!, 10);
  const year = parseInt(searchParams.get("year")!, 10);
  if (isNaN(month) || isNaN(year))
    return NextResponse.json(
      { error: "Invalid month or year search parameters" },
      { status: 400 }
    );

  await dbConnect();
  const user = await UserRepository.findById(session.user?._id);
  if (user) {
    const logs = user.logs.filter(
      (log) =>
        log.createdAt!.getMonth() === month &&
        log.createdAt!.getFullYear() === year
    );

    // Let's return an object that lets the client know the number of logs found, month and year of the logs.
    return NextResponse.json(
      { month, year, logs, count: logs.length },
      { status: 200 }
    );
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
