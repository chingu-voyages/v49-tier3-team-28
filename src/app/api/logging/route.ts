import dbConnect from "@/lib/mongodb/mongodb";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const requestBody = await req.formData()
  

  console.log(requestBody.get("log"))


  return NextResponse.json(requestBody, { status: 201 });
}