"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moduleStyles from "../home-page.module.css";

export default function LandingPage() {
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
      {/* Header */}
      <div className="flex flex-col gap-y-10">
        <h1 className={` ${moduleStyles.titleLogo} text-5xl leading-6`}>
          Welcome User
        </h1>
        <h3>{currentDate}</h3>
      </div>
      {/* Logging Button */}
      <div className="flex flex-col gap-y-9">
        <div>
          <Link href="/logging">
            <BasicRoundedButton label="Start Logging" />
          </Link>
        </div>
      </div>
      {/* Metrics */}
      <div className="flex flex-col gap-y-9">
        <h1 className={` ${moduleStyles.titleLogo} text-5xl leading-6`}>
          Metrics
        </h1>
        <div className="flex gap-x-5">
          <div>Logging Journal</div>
          <div>Favorite Exercise</div>
          <div>Overview</div>
        </div>
      </div>
    </div>
  );
}
