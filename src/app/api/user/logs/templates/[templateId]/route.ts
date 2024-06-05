import authOptions from "@/app/api/auth/auth-options";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { Session, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function findUserAndTemplate(
  session: Session | null,
  templateId: string
) {
  if (!session?.user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  await dbConnect();
  const user = await UserRepository.findById(session.user._id);

  if (!user) {
    return {
      response: NextResponse.json({ error: "User not found" }, { status: 404 }),
      user: null,
    };
  }

  const templateIndex = user.logs.findIndex((log) => log._id == templateId);

  if (templateIndex === -1) {
    return {
      response: NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      ),
      user: null,
    };
  }

  return { user, templateIndex, response: null };
}

// GET
export async function GET(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  const result = await findUserAndTemplate(session, templateId);

  if (!result.user) {
    return result.response;
  }

  const templates = result.user.logs.filter(
    (log) => log.isTemplate && log.name && log._id == templateId
  );

  return NextResponse.json(templates, { status: 200 });
}

// DELETE
export async function DELETE(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  const result = await findUserAndTemplate(session, templateId);

  if (!result.user) {
    return result.response;
  }

  result.user.logs.splice(result.templateIndex, 1);
  await result.user.save();

  return NextResponse.json(
    { message: "Template deleted successfully" },
    { status: 200 }
  );
}

// PATCH
export async function PATCH(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  const result = await findUserAndTemplate(session, templateId);

  if (!result.user) {
    return result.response;
  }

  try {
    const updatedFields = await req.json();
    Object.assign(result.user.logs[result.templateIndex], updatedFields);
    await result.user.save();

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
