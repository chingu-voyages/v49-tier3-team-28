import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

// Creates a new user in the DB
export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  // TODO: here we can use yup to validate the request body

  const { email, password, username } = requestBody;

  await dbConnect();
  // Check if the user already exists
  const userExists = await UserRepository.findOne({ email });

  if (userExists)
    return NextResponse.json(
      { message: `User with email ${email} already exists` },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(password, 10);
  // Create the user in the db
  const createdUser = await UserRepository.create({
    email,
    password: hashedPassword,
    username,
  });

  return NextResponse.json({ id: createdUser._id }, { status: 201 });
}
