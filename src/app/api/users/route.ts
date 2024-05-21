import { UserRepository } from "@/schemas/user.schema";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const users = await UserRepository.find({}).select("-password"); // Fetch all users
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
