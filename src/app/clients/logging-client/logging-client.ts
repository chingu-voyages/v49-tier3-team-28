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
};
