import { Log } from "@/models/log.model";
interface LogsByMonthYearAPIResponse {
  month: number;
  year: number;
  logs: Log[];
  count: number;
}

export const LoggingClient = {
  /**
   * Sends a log to the backend API.
   */
  async saveLog({ logs }: { logs: Partial<Log>[] }): Promise<void> {
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

  async getTemplates(): Promise<Log[]> {
    const response = await fetch("/api/user/logs/templates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },
  /**
   * Return an array of logs from the requesting user's fitness logs.
   * @param month 0 based month (0 = January, 1 = February, etc.)
   * @param year
   */
  async getLogsByMonthAndYear(
    month: number,
    year: number
  ): Promise<LogsByMonthYearAPIResponse> {
    const response = await fetch(`/api/user/logs?month=${month}&year=${year}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json() as Promise<LogsByMonthYearAPIResponse>;
  },

  async deleteTemplate(templateId: string): Promise<void> {
    const response = await fetch(`/api/user/logs/templates/${templateId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    console.log("Template deleted successfully!");
  },

  async updateTemplate(updatedTemplateData: Partial<Log>): Promise<void> {
    const response = await fetch(
      `/api/user/logs/templates/${updatedTemplateData._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTemplateData),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    console.log("Template updated successfully!");
  },
};
