import { AuthSessionProvider } from "@/lib/contexts/auth-context/auth-context";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers/nextAuth/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <NextAuthProvider>
          <AuthSessionProvider>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </AuthSessionProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
