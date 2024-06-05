import { AuthSessionProvider } from "@/lib/contexts/auth-context/auth-context";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./providers/nextAuth/next-auth-provider";

export const metadata: Metadata = {
  title: "FitFlex",
  description: "Exercise logging app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/eoe3hsu.css"
        ></link>
      </head>
      <body>
        <NextAuthProvider>
          <AuthSessionProvider>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </AuthSessionProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
