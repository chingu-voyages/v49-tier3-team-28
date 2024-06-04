"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { CalendarLogViewer } from "@/components/calendar-log-viewer/Calendar-log-viewer";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Link } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function LandingPage() {
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
    <div className="flex flex-col items-center gap-y-36 justify-center w-screen h-screen bg-cover bg-no-repeat bg-center">
      {/* Header */}
      <div className="flex w-2/3 justify-between">
        <div className="flex flex-col gap-y-10">
          <h1 className={`text-5xl leading-6`}>
            Welcome {session?.user?.username}
          </h1>
          <h3>{dayjs().format("ddd, MMMM D, YYYY")}</h3>
        </div>
        <Link href="/user/mytemplates">
          <BasicRoundedButton
            label="Manage Templates"
            buttonClassNames="!w-36"
            customMaterialButtonStyles={{
              fontSize: "10px",
              backgroundColor: "#95A1A8",
            }}
          />
        </Link>
      </div>
      {/* Logging Button */}
      <div className="flex flex-col gap-y-9">
        <div className="w-80">
          <Link href="/user/createlog">
            <BasicRoundedButton label="Start Logging" />
          </Link>
        </div>
      </div>
      {/* Metrics */}
      <div className="flex flex-col gap-y-9 w-96">
        <div className="flex justify-between">
          <h2 className="text-3xl flex justify-center align-center text-center">
            Journal Tracker
          </h2>
          <div className="w-30">
            <Link href="/user/viewlogs">
              <BasicRoundedButton
                label="View Logs"
                buttonClassNames="!w-24 !h-8"
                customMaterialButtonStyles={{
                  fontSize: "10px",
                  backgroundColor: "#03BB9B",
                }}
              />
            </Link>
          </div>
        </div>
        <CalendarLogViewer readonly />
      </div>
    </div>
  );
}
