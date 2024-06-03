import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { Log } from "@/models/log.model";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

// Goals for functionality:
/* 
1. Future date is disabled.
2. How far back do we allow the user to go?
*/

export function CalendarLogViewer() {
  const [currentLogsByMonthAndYear, setCurrentLogsByMonthAndYear] = useState<
    Log[]
  >([]); // Store the logs for the current month and year.
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]); // The days that will be highlighted in the calendar.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // When the component mounts, we need to fetch the logs for the current month and year.
    // This is assuming that when the calendar component mounts, it will be the current month and year.
    fetchLogsByMonthAndYear(new Date().getMonth(), new Date().getFullYear());
  }, []);

  const fetchLogsByMonthAndYear = async (month: number, year: number) => {
    // When the month changes, we need to fetch the logs for that month and year.
    try {
      setIsLoading(true);
      const apiDataResponse = await LoggingClient.getLogsByMonthAndYear(
        month,
        year
      );

      setCurrentLogsByMonthAndYear(apiDataResponse.logs);
      setHighlightedDays(extractHighligtedDaysFromLogs(apiDataResponse.logs));
    } catch (e: any) {
      // TODO: Do something with the error.
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = async (date: Dayjs) => {
    // When the month changes, we need to fetch the logs for that month and year.
    await fetchLogsByMonthAndYear(date.month(), date.year());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        disableFuture
        disabled={isLoading}
        slots={{
          day: (
            props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
          ) => {
            const {
              highlightedDays = [],
              day,
              outsideCurrentMonth,
              ...other
            } = props;
            const isSelected =
              !props.outsideCurrentMonth &&
              highlightedDays.indexOf(props.day.date()) >= 0;
            return (
              <PickersDay
                {...other}
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
                sx={{
                  backgroundColor: isSelected ? "#2F4858" : "inherit",
                  color: isSelected ? "white" : "inherit",
                  fontWeight: 700,
                }}
              />
            );
          },
        }}
        slotProps={{
          day: {
            highlightedDays: highlightedDays,
          } as any,
        }}
        sx={{
          "& .MuiPickersCalendarHeader-label": {
            backgroundColor: "#03BB9B",
            borderRadius: "20px",
            paddingLeft: "10px",
            paddingRight: "10px",
            fontWeight: 700,
            color: "white",
          },
          "& .MuiPickersCalendarHeader-switchViewIcon": {
            display: "none",
          },
        }}
        onMonthChange={handleMonthChange}
      />
    </LocalizationProvider>
  );
}

function extractHighligtedDaysFromLogs(logs: Log[]): number[] {
  return logs.map((log) => dayjs(log.createdAt).date());
}
