import NextAuth from "next-auth/next";
import authOptions from "../auth-options";

const nextAuthOptions = NextAuth(authOptions);
export { nextAuthOptions as GET, nextAuthOptions as POST };
