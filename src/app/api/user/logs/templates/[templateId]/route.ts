import authOptions from "@/app/api/auth/auth-options";
import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET REQUEST
export async function GET(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const user = await UserRepository.findById(session.user._id);

  if (user) {
    const templates = user?.logs.filter(
      (log) => log.isTemplate && log.name && log._id == templateId
    );

    return NextResponse.json(templates, { status: 200 });
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

// DELETE REQUEST
export async function DELETE(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const user = await UserRepository.findById(session.user._id);

  if (user) {
    const templateIndex = user.logs.findIndex((log) => log._id == templateId);

    if (templateIndex !== -1) {
      user.logs.splice(templateIndex, 1);

      await user.save();

      return NextResponse.json(
        { message: "Template deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }
  }

  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

// PUT REQUEST
export async function PUT(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { templateId } = context.params;

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();

    const user = await UserRepository.findById(session.user._id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const templateIndex = user.logs.findIndex((log) => log._id == templateId);

    if (templateIndex === -1) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    user.logs[templateIndex] = { ...user.logs[templateIndex], ...req.body };

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
