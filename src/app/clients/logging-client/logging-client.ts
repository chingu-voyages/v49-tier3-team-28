export const LoggingClient = {
  /**
   * Sends a log to the backend API.
   */
  async saveLog({
    userId,
    sessions,
  }: {
    userId: string;
    sessions: Array<{
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
    }>;
  }): Promise<void> {
    const formData = {
      userId: userId,
      sessions: sessions,
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
