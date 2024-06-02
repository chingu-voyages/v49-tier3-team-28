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

  // Right now, we're simply concatenating the new logs to the existing logs array.
  user.logs = user.logs.concat(requestBody.logs);

  await user.save();
  return NextResponse.json(
    { message: "Logs saved successfully" },
    { status: 200 }
  );
}
