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
      name: string | Date;
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
};
