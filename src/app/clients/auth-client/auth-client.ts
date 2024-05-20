import { signIn } from "next-auth/react";

// Functions grouped together for authentication related requests (signup, signin, signout)
export const AuthClient = {
  /**
   * Sends request to create a user in the system, registering them for the app.
   * @param param0
   */
  async signUpUser({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<void> {
    const req = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!req.ok) {
      const response: any = await req.json();
      throw new Error(response?.message || "Error: Cannot register user");
    }
  },
  signInUser: async ({
    email,
    password,
    callbackUrl,
    isRegistering = false,
  }: {
    email: string;
    password: string;
    callbackUrl?: string;
    isRegistering?: boolean;
  }): Promise<{ success: boolean; errorMessage?: string }> => {
    /* 
    This function handles signin using nextAuth signIn function.
    There is also logic here to handle the signin flow when the user is registering, as after
    user has successfully created an account, we can immediately log them in to a session.
    */

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl,
    });

    if (res === null) {
      if (isRegistering) {
        throw new Error("We have experienced an error.");
      }
      return {
        success: false,
        errorMessage: "An unknown error occured. Please try again.",
      };
    }

    // This is to handle basic sign in
    if (res?.ok) return { success: true };
    return {
      success: false,
      errorMessage: "Please check your credentials and try again",
    };
  },
};
