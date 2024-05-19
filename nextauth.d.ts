import { User as FitnessUser } from "@/models/user.model";
import "next-auth";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends Partial<FitnessUser> {
    _id?: string;
  }

  interface Session {
    user?: DefaultUser & Partial<User> & { _id: string };
  }
}
