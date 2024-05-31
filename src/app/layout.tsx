import { AuthSessionProvider } from "@/lib/contexts/auth-context/auth-context";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
      <body>
        <NextAuthProvider>
          <AuthSessionProvider>
            <AppRouterCacheProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {children}
              </LocalizationProvider>
            </AppRouterCacheProvider>
          </AuthSessionProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
