"use client";
import { CalendarLogViewer } from "@/components/calendar-log-viewer/Calendar-log-viewer";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ViewLogs() {
  const { status } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  // Users who are not authenticated will be redirected to the sign in page.
  if (status === "unauthenticated") {
    return router.replace("/signin");
  }

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <div className="self-center cursor-pointer">
          <Link href={"/user/home"}>
            <Image
              src="/images/buttons/back-button-left.svg"
              height={48}
              width={48}
              alt="Back button"
            />
          </Link>
        </div>
        <div>
          <h1
            className={`text-2xl leading-7 openSansFont font-bold uppercase py-6`}
          >
            My Logs
          </h1>
        </div>
      </div>
      <CalendarLogViewer />
    </div>
  );
}
