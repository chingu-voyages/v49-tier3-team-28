import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

// Goals for functionality:
/* 
1. Future date is disabled.
2. How far back do we allow the user to go?
*/

export function CalendarLogViewer() {
  const handleMonthChange = async (date: Dayjs) => {
    // When the month changes, we need to fetch the logs for that month and year.
    try {
      const fetchedLogsByMonthAndYear =
        await LoggingClient.getLogsByMonthAndYear(date.month(), date.year());
    } catch (e: any) {
      // Do something with the error.
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        view="day"
        disableFuture
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
            highlightedDays: [1, 6, 32],
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
