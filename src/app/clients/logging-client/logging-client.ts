import { Log } from "@/models/log.model";

export const LoggingClient = {
  /**
   * Sends a log to the backend API.
   */
  async saveLog({
    userId,
    logs,
  }: {
    userId: string;
    logs: Array<{
      date: Date;
      exercises: Array<{
        exerciseName: string;
        sets: Array<{
          setNumber: number;
          weight: number;
          unit: string;
          reps: number;
        }>;
      }>;
      isTemplate: boolean;
    }>;
  }): Promise<void> {
    const formData = {
      userId: userId,
      logs: logs,
    };

    const jsonData = JSON.stringify(formData);
    console.log(jsonData);

    try {
      const response = await fetch("/api/logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      console.log("Log saved successfully!");
    } catch (error) {
      console.error("An error occurred while saving the log:", error);
    }
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
