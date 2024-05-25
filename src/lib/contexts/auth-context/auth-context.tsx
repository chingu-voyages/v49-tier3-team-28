"use client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";

type UpdateSession = (data?: any) => Promise<Session | null>;

interface AuthContextInterface {
  status: "unauthenticated" | "loading" | "authenticated";
  session: Session | null;
  update: UpdateSession | null; //  This is used when some aspect of the session needs to be updated (ex. the user updates their username)
}

// Creating a context with initialState
const AuthenticationContext = React.createContext<AuthContextInterface>({
  status: "unauthenticated",
  session: null,
  update: null,
});

// This is the context provider that will wrap around our app in layout.tsx
// This will allow us to access the nextAuth session object in any component (using the useAuthSession hook)
export const AuthSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status, update } = useSession();

  return (
    <AuthenticationContext.Provider value={{ status, session, update }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

// This is the actual react hook that we use in the component to access the nextAuth session.
export const useAuthSession = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthSession must be used within an AuthSessionProvider"
    );
  }
  return context;
};
