import authOptions from "@/app/api/auth/auth-options";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// The GET route that fetches all of the templates for the session user
// `/api/user/logs/templates`
export async function GET(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { params } = context;

  console.log(params.templateId);

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const user = await UserRepository.findById(session.user._id);

  if (user) {
    const templates = user?.logs.filter(
      (log) => log.isTemplate && log.name && log._id == params.templateId
    );

    return NextResponse.json(templates, { status: 200 });
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
