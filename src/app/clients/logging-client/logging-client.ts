import { Log } from "@/models/log.model";

export const LoggingClient = {
  /**
   * Sends a log to the backend API.
   */
  async saveLog({ logs }: { logs: Log[] }): Promise<void> {
    const response = await fetch("/api/user/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logs,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    console.log("Log saved successfully!");
  },
  /**
   * Return an array of logs from the requesting user's fitness logs.
   * @param month 0 based month (0 = January, 1 = February, etc.)
   * @param year
   */
  async getLogsByMonthAndYear(month: number, year: number): Promise<Log[]> {
    const response = await fetch(`/api/user/logs?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },
};
