"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moduleStyles from "../home-page.module.css";

export default function Logging() {
  // State to hold the current date
  const [currentDate, setCurrentDate] = useState("");

  // useEffect to set the current date when the component mounts
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  /*
    This is an example of how to use the hook to access the auth session, which indicates if user is logged in or not.
    It also has basic user data that we may need to use on the front end (like the email, username, _id).
    We can always add more data to the session object in the auth-options.ts file.
  */
  const { status } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  // Users who are not authenticated will be redirected to the sign in page.
  if (status === "unauthenticated") {
    router.replace("/signin");
    return null; // Ensure the component does not render until redirection
  }

  return (
    <div className="flex flex-col items-center gap-y-36 justify-center w-screen h-screen bg-cover bg-no-repeat bg-center">
      {/* Header */}
      <div className="flex flex-col gap-y-10">
        <h1 className={` ${moduleStyles.titleLogo} text-5xl leading-6`}>
          Log From Scratch
        </h1>
        <h3>{currentDate}</h3>
        <h3>How do you want to log your exercise today?</h3>
      </div>
      {/* Logging Button */}
      <div className="flex flex-col gap-y-9">
        <div className="flex flex-col gap-y-10">
          <Link href="/createlog">
            <BasicRoundedButton label="Create New Log" />
          </Link>
          <Link href="/templates">
            <BasicRoundedButton
              label="View Templates"
              buttonClassNames={`${moduleStyles.grayButton}`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
