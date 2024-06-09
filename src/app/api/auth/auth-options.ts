import dbConnect from "@/lib/mongodb/mongodb";
import { UserRepository } from "@/schemas/user.schema";
import bcrypt, { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ profile }) {
      // This function is called when a user signs in. If profile is defined it's a googleOAuth sign in
      if (profile) {
        await dbConnect();

        const user = await UserRepository.findOne({ email: profile.email });

        if (!user) {
          const hashedPassword = await bcrypt.hash(
            generateRandomPassword(),
            10
          );
          try {
            await UserRepository.create({
              email: profile.email,
              username: profile.name,
              password: hashedPassword,
              oAuth: true,
            });
          } catch (error) {
            console.error(error);
          }
        }
      }

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
    GoogleProvider({
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
    signIn: "/signin",
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

const generateRandomPassword = (length: number = 6): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
