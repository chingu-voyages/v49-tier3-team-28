"use client";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { useRouter } from "next/navigation";
import { CalendarLogViewer } from "@/components/calendar-log-viewer/Calendar-log-viewer";


export default function ViewLogs() {

  /*
    This is an example of how to use the hook to access the auth sesion, which indicates if user is logged in or not.
    It also has basic user data that we may need to use on the front end (like the email, username, _id).
    We can always add more data to the session object in the auth-options.ts file.
  */
  const { status, session } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  // Users who are not authenticated will be redirected to the sign in page.
  if (status === "unauthenticated") {
    return router.replace("/signin");
  }

  return (
    <div>
      <CalendarLogViewer />
    </div>
  )
}