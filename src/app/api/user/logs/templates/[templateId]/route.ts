import authOptions from "@/app/api/auth/auth-options";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { Session, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function findUserAndTemplate(
  session: Session | null,
  templateId: String
) {
  if (!session?.user) {
    return { status: 401, response: { error: "Unauthorized" } };
  }

  await dbConnect();
  const user = await UserRepository.findById(session.user._id);

  if (!user) {
    return { status: 404, response: { error: "User not found" } };
  }

  const templateIndex = user.logs.findIndex((log) => log._id == templateId);

  if (templateIndex === -1) {
    return { status: 404, response: { error: "Template not found" } };
  }

  return { user, templateIndex };
}

// GET
export async function GET(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  const { user, templateIndex, status, response } = await findUserAndTemplate(
    session,
    templateId
  );

  if (!user) {
    return NextResponse.json(response, { status });
  }

  const templates = user?.logs.filter(
    (log) => log.isTemplate && log.name && log._id == templateId
  );

  return NextResponse.json(templates, { status: 200 });
}

// DELETE
export async function DELETE(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  const { user, templateIndex, status, response } = await findUserAndTemplate(
    session,
    templateId
  );

  if (!user) {
    return NextResponse.json(response, { status });
  }

  user.logs.splice(templateIndex, 1);
  await user.save();

  return NextResponse.json(
    { message: "Template deleted successfully" },
    { status: 200 }
  );
}

// PATCH
export async function PATCH(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  const { user, templateIndex, status, response } = await findUserAndTemplate(
    session,
    templateId
  );

  if (!user) {
    return NextResponse.json(response, { status });
  }

  try {
    const updatedFields = await req.json();

    Object.assign(user.logs[templateIndex], updatedFields);

    await user.save();

    return NextResponse.json(
      { message: "Template updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
