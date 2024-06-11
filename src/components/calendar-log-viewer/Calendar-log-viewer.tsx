import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { Alert, CircularProgress } from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

interface CalendarLogViewerProps {
  readonly?: boolean;
}

export function CalendarLogViewer({ readonly }: CalendarLogViewerProps) {
  const [currentLogsByMonthAndYear, setCurrentLogsByMonthAndYear] = useState<
    Log[]
  >([]);

  const [highlightedDays, setHighlightedDays] = useState<number[]>([]); // The days that will be highlighted in the calendar.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    // When the calendar mounts, we need to render the highlights for the current month
    // And if there are any logs for the current date, load them
    const fetchLogsForCurrentDate = async () => {
      try {
        setIsLoading(true);
        const apiDataResponse = await LoggingClient.getLogsByMonthAndYear(
          dayjs().month(),
          dayjs().year()
        );
        setCurrentLogsByMonthAndYear(apiDataResponse.logs);
        setHighlightedDays(extractHighligtedDaysFromLogs(apiDataResponse.logs));
      } catch (e: any) {
        setErrorMessage(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogsForCurrentDate();
  }, []);

  const handleMonthChange = async (date: Dayjs) => {
    // When the month changes, we need to fetch the logs for that month and year to highlight the days in calendar
    try {
      setIsLoading(true);
      const apiDataResponse = await LoggingClient.getLogsByMonthAndYear(
        date.month(),
        date.year()
      );

      setHighlightedDays(extractHighligtedDaysFromLogs(apiDataResponse.logs));
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalendarDateChange = async (date: Dayjs) => {
    // When the user selects a date, we need to fetch the logs for that date.
    setValue(date);
    try {
      setIsLoading(true);
      const apiResponse = await LoggingClient.getLogsByMonthAndYear(
        date.month(),
        date.year()
      );
      setCurrentLogsByMonthAndYear(apiResponse.logs);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex justify-center flex-col p-4">
        {isLoading && (
          <div className="absolute left-1/2 inset-y-1/4">
            <CircularProgress />
          </div>
        )}
        <DateCalendar
          readOnly={readonly}
          disableFuture
          disabled={isLoading}
          value={value}
          onChange={handleCalendarDateChange}
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
                    color: "black",
                    fontWeight: 700,
                    "&.MuiPickersDay-root": {
                      borderRadius: "50%",
                      border: isSelected ? "2px solid var(--orange)" : "none",
                    },
                    "&.MuiPickersDay-root:hover": {
                      opacity: 0.5,
                    },
                    "&.Mui-selected": {
                      backgroundColor: "var(--orange)",
                      color: "white",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "var(--orange)",
                      opacity: 0.8,
                    },
                    "&.Mui-selected:focus": {
                      backgroundColor: "var(--orange)",
                    },
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
      </div>
      <div>
        {errorMessage && (
          <Alert severity="error" variant="outlined" sx={{ marginTop: "10px" }}>
            {errorMessage}
          </Alert>
        )}
      </div>
      {!readonly && (
        <div>
          <div>
            <h4 className="text-center">{value?.format("ddd MMMM D, YYYY")}</h4>
          </div>

          <div>
            {/* Logs for a selected date appear here */}
            {renderLogsForDay(value, currentLogsByMonthAndYear)}
          </div>
        </div>
      )}
    </LocalizationProvider>
  );
}

function extractHighligtedDaysFromLogs(logs: Log[]): number[] {
  return logs.map((log) => dayjs(log.createdAt).date());
}

function renderLogsForDay(
  dateData: Dayjs | null,
  logs: Log[]
): JSX.Element[] | null {
  // Logs should be the current month's logs stored in the state
  if (dateData === null) return null;

  const renderedLogData = logs
    .filter((log) => dayjs(log.createdAt).date() === dateData.date())
    .map((log) => {
      return renderExerciseTables(log.exercises);
    });

  return renderedLogData.length > 0
    ? renderedLogData
    : [<p className="text-center transition-opacity">No logs for this date</p>];
}

const renderExerciseTables = (ex: ExerciseActivity[]) => {
  return (
    <div className="p-4">
      {ex.map((exercise) => {
        return (
          <>
            <div>
              <h4 className="text-white text-sm font-bold p-2 defaultButtonColor">
                {exercise.exerciseName}
              </h4>
            </div>
            <table className="w-full border-collapse bg-white">
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr
                    key={(set as any).id}
                    className="odd:bg-orange-100 text-center text-sm"
                  >
                    <td className="p-2 text-center">{setIndex + 1}</td>
                    <td className="p-2">
                      <div className="flex">
                        <p>{set.weight}</p>

                        <div>
                          <p className="px-2 self-center">{set.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center ">
                      <div className="flex">
                        <p>{set.reps}</p>

                        <p className="px-2 self-center">reps</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      })}
    </div>
  );
};
