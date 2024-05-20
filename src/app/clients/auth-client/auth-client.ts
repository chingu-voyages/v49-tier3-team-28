import { signIn } from "next-auth/react";

// Functions grouped together for authentication related requests (signup, signin, signout)
export const AuthClient = {
  /**
   * Sends request to the backend to create a user.
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
  /**
   * Sends request to the backend to sign in the user and create a nextAuth session
   */
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
    This function handles signIn using nextAuth, which manages sessions for us.
    There is logic here to handle the sign in flow differently if the user is registering.
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
