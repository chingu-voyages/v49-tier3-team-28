import { AppMenuBar } from "@/components/app-menu-bar/App-menu-bar";
import React from "react";

export default function AuthenticatedUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppMenuBar />
      <div className="flex flex-grow justify-center">{children}</div>
    </div>
  );
}
