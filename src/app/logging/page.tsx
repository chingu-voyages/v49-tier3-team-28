"use client";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { useRouter } from "next/navigation";

export default function Logging() {
  /*
    This is an example of how to use the hook to access the auth sesion, which indicates if user is logged in or not.
    It also has basic user data that we may need to use on the front end (like the email, username, _id).
    We can always add more data to the session object in the auth-options.ts file.
  */
  const { status } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  // Users who are not authenticated will be redirected to the sign in page.
  if (status === "unauthenticated") {
    return router.replace("/signin");
  }

  return (
    <div className="flex flex-col items-center gap-y-36 justify-center w-screen h-screen bg-cover bg-no-repeat bg-center">
      Logging Page
    </div>
  );
}
