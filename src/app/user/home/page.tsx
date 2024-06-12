"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { CalendarLogViewer } from "@/components/calendar-log-viewer/Calendar-log-viewer";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CircularProgress, Link } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
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

  if (status === "loading")
    return (
      <div className="flex justify-center" style={{ marginTop: "40%" }}>
        <CircularProgress />;
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-y-8 justify-center w-screen bg-cover bg-no-repeat bg-center mt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex gap-4">
          <h1
            className={`text-xl leading-7 futuraFont font-bold uppercase self-center py-6`}
          >
            Welcome, {session?.user?.username}
          </h1>
          <Link href="/user/mytemplates" className="self-center">
            <BasicRoundedButton
              label="Manage Templates"
              buttonClassNames="!w-36"
              customMaterialButtonStyles={{
                fontSize: "12px",
                fontFamily: "Roboto",
                lineHeight: "15px",
                backgroundColor: "#95A1A8",
              }}
            />
          </Link>
        </div>

        <div>
          <h3 className="verdanaFont text-sm leading-4">
            {dayjs().format("ddd, MMMM D, YYYY")}
          </h3>
        </div>
      </motion.div>

      {/* Logging Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col min-w-[360px]"
      >
        <Link href="/user/createlog">
          <BasicRoundedButton
            label="Start Logging"
            buttonClassNames="defaultButtonColor h-14 !justify-between !w-full "
            endIcon={
              <ArrowForwardIcon
                sx={{
                  background: "white",
                  color: "#143452",
                  borderRadius: "50%",
                  "&.MuiSvgIcon-root": {
                    fontSize: "40px",
                  },
                }}
              />
            }
          />
        </Link>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-col gap-y-9 w-80 mt-8"
      >
        <div className="flex justify-between">
          <h1 className="futuraFont text-base font-bold uppercase">
            Journal Tracker
          </h1>
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
      </motion.div>
    </div>
  );
}
