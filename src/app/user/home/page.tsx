"use client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { CalendarLogViewer } from "@/components/calendar-log-viewer/Calendar-log-viewer";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { CircularProgress, Link } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const { status, session } = useAuthSession();
  const router = useRouter();
  const [isPageLoadingTemplates, setIsPageLoadingTemplates] =
    useState<boolean>(false);
  const [isPageLoadingStartLogging, setIsPageLoadingStartLogging] =
    useState<boolean>(false);
  const [isPageLoadingStartViewLogs, setIsPageLoadingViewLogs] =
    useState<boolean>(false);

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
            className={`text-xl leading-7 openSansFont font-bold uppercase self-center py-6`}
          >
            Welcome, {session?.user?.username}
          </h1>
          <Link
            href="/user/mytemplates"
            className="self-center"
            onClick={() => setIsPageLoadingTemplates(true)}
          >
            <BasicRoundedButton
              label="Manage Templates"
              buttonClassNames="!w-36"
              disabled={
                isPageLoadingTemplates ||
                isPageLoadingStartLogging ||
                isPageLoadingStartViewLogs
              }
              customMaterialButtonStyles={{
                fontSize: "12px",
                fontFamily: "Roboto",
                lineHeight: "15px",
                backgroundColor: "#95A1A8",
              }}
            >
              {isPageLoadingTemplates && (
                <CircularProgress size={30} sx={{ color: "orange" }} />
              )}
            </BasicRoundedButton>
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
        <Link
          href="/user/createlog"
          onClick={() => setIsPageLoadingStartLogging(true)}
        >
          <BasicRoundedButton
            label="Start Logging"
            buttonClassNames="defaultButtonColor h-14 !justify-between !w-full"
            disabled={
              isPageLoadingTemplates ||
              isPageLoadingStartLogging ||
              isPageLoadingStartViewLogs
            }
            endIcon={
              <Image
                src="/images/buttons/go-button.svg"
                alt="start-logging"
                width={48}
                height={48}
                className="relative left-1.5"
              />
            }
          >
            {isPageLoadingStartLogging && (
              <CircularProgress size={30} sx={{ color: "white" }} />
            )}
          </BasicRoundedButton>
        </Link>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-col gap-y-9 mt-8"
      >
        <div className="flex justify-between">
          <h1 className="openSansFont text-base font-bold uppercase">
            Journal Tracker
          </h1>
          <div className="w-30">
            <Link
              href="/user/viewlogs"
              onClick={() => setIsPageLoadingViewLogs(true)}
            >
              <BasicRoundedButton
                label="View Logs"
                buttonClassNames="!w-24 !h-8"
                disabled={
                  isPageLoadingTemplates ||
                  isPageLoadingStartLogging ||
                  isPageLoadingStartViewLogs
                }
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
