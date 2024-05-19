import dbConnect from "@/lib/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token }) {
      await dbConnect();

      const userSession = await UserRepository.findOne({
        email: token.email,
      }).select("-password");

      // We can decide what element we want to include in the token
      token = {
        ...token,
        _id: userSession?._id.toString(),
        username: userSession?.username,
      };

      return token;
    },
    async session({ session, token }) {
      session = {
        ...session,
        user: {
          username: token.username as string,
          email: token.email as string,
          _id: token._id as string,
        } as any,
      };

      return session;
    },
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
        email: {
          label: "Email",
          type: "text",
        },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await UserRepository.findOne({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!user) return null;

        if (await compare(credentials!.password, user.password)) {
          // Info for the JWT token
          return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
          } as any;
        } else {
          console.log("Invalid Password");
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
