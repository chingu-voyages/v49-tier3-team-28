import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { Log } from "@/models/log.model";
import { BarChart } from "@mui/x-charts";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

// This chart should show the last thirty days of exercise data. It should show the number of exercises completed each day.
export function MonthToDateExerciseChart() {
  const [thirtyDaysLogs, setThirtyDaysLogs] = useState<Log[]>([]);

  const fetchLast30DaysLogData = async () => {
    const fetchRequests = [];
    const lastThirtyDays = dayjs().subtract(30, "day");
    fetchRequests.push(
      LoggingClient.getLogsByMonthAndYear(dayjs().month(), dayjs().year())
    );

    if (lastThirtyDays.month() !== dayjs().month()) {
      // Do the request for the previous month
      fetchRequests.push(
        LoggingClient.getLogsByMonthAndYear(
          dayjs().subtract(1, "month").month(),
          dayjs().year()
        )
      );
    }

    try {
      const fetchResults = await Promise.all(fetchRequests);
      const logs = fetchResults
        .flat()
        .map((result) => result.logs)
        .flat();

      setThirtyDaysLogs(logs);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchLast30DaysLogData();
  }, []);

  return (
    <div style={{ height: "300px", width: "380px" }}>
      <BarChart
        xAxis={[
          {
            id: "test",
            data: calculateLastThirtyDaysFromToday().map((day) => day.date()),
            scaleType: "band",
          },
        ]}
        series={[
          {
            data:
              thirtyDaysLogs &&
              extractExerciseLogDataByDate(
                thirtyDaysLogs,
                calculateLastThirtyDaysFromToday()
              ),
            color: "var(--orange)",
          },
        ]}
      />
      <p className="verdanaFont text-center text-sm">
        Exercises (30 day trend){" "}
      </p>
    </div>
  );
}

function calculateLastThirtyDaysFromToday(): Dayjs[] {
  const lastThirtyDays: Dayjs[] = [];
  for (let i = 0; i < 30; i++) {
    lastThirtyDays.push(dayjs().subtract(i, "day"));
  }
  return lastThirtyDays.reverse();
}

function extractExerciseLogDataByDate(
  logs: Log[],
  calendarDays: Dayjs[]
): number[] {
  return calendarDays.map((day) => {
    const logsForDay = logs.filter((log) =>
      dayjs(log.createdAt).isSame(day, "date")
    );

    return logsForDay.reduce((acc, log) => {
      return acc + log.exercises.length;
    }, 0);
  });
}
