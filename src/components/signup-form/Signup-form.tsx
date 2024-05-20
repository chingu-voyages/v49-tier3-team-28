"use client";
import { AuthClient } from "@/app/clients/auth-client/auth-client";
import { signupFormValidator } from "@/app/validators/signup/signup-form.validator";
import { extractValidationErrors } from "@/app/validators/utils/extract-validation-errors/extract-validation-errors";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import { GoogleAuthButton } from "../buttons/google-auth-button/Google-auth-button";
import { PasswordInputField } from "../input-fields/password-input-field/Password-input-field";
import { FormTextInputField } from "../input-fields/text-input-field/Form-text-input-field";

export default function SignupForm() {
  const [formFieldValues, setFormFieldValues] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  // Keeps track of each field's error state and message
  const [formFieldErrors, setFormFieldErrors] = useState<
    Record<string, { error: boolean; message: string }>
  >({
    username: { error: false, message: "" },
    email: { error: false, message: "" },
    password1: { error: false, message: "" },
    password2: { error: false, message: "" },
  });

  // If there are any errors with API calls or other errors, this will be set
  const [appError, setAppError] = useState({
    error: false,
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const formFieldsValid = (): boolean => {
    // TODO: We may be able to extract this logic so it can be used in signin?
    try {
      signupFormValidator.validateSync(formFieldValues, { abortEarly: false });
    } catch (error) {
      const errors = extractValidationErrors(error);
      setFormFieldErrors(errors);
      return false;
    }
    return true;
  };

  const signUpUser = async () => {
    // Validate the form fields and register the user if valid
    if (formFieldsValid()) {
      setIsLoading(true);
      try {
        await AuthClient.signUpUser({
          username: formFieldValues.username,
          email: formFieldValues.email,
          password: formFieldValues.password1,
        });
      } catch (error: any) {
        // If there is an error, set the error state and abort
        setAppError({ error: true, message: error });
        setIsLoading(false);
        return;
      }

      // If there was no error, sign the user in using the isRegistering flag
      try {
        await AuthClient.signInUser({
          email: formFieldValues.email,
          password: formFieldValues.password1,
          isRegistering: true,
          callbackUrl: "/", // TODO: Update this, user should be redirected to 'my sets page' as per the trello card?
        });
      } catch (error: any) {
        setAppError({ error: true, message: error });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`mt-6`}>
      <h1 className={"font-bold leading-7 text-xl uppercase mt-14"}>
        Let's get started!
      </h1>
      <div>
        <h2 className="font-normal leading-7 text-xs">
          Fill in the form below to join our community.
        </h2>
      </div>
      <div className="mt-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-elements flex flex-col justify-between gap-y-3 p-5">
            <FormTextInputField
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              error={formFieldErrors.username?.error}
              helperText={formFieldErrors.username?.message}
              disabled={isLoading}
              onChange={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  username: value,
                });
              }}
            />
            <FormTextInputField
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              error={formFieldErrors.email?.error}
              helperText={formFieldErrors.email?.message}
              disabled={isLoading}
              onChange={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  email: value,
                });
              }}
            />
            <PasswordInputField
              id="password1"
              name="password1"
              placeholder="Enter password"
              error={formFieldErrors.password1?.error}
              helperText={formFieldErrors.password1?.message}
              disabled={isLoading}
              onInputChanged={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  password1: value,
                });
              }}
            />
            <PasswordInputField
              id="password2"
              name="password2"
              placeholder="Confirm password"
              error={formFieldErrors.password2?.error}
              helperText={formFieldErrors.password2?.message}
              disabled={isLoading}
              onInputChanged={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  password2: value,
                });
              }}
            />
            {isLoading && (
              <div className="flex justify-center">
                <CircularProgress
                  sx={{
                    color: "var(--orange)",
                  }}
                />
              </div>
            )}
            {/* API errors */}
            {appError.error && (
              <div className="flex justify-center text-red-500 text-sm font-normal">
                {appError.message}
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="text-center mt-6">
        <div>
          <BasicRoundedButton
            label="Sign up"
            onClick={signUpUser}
            disabled={isLoading}
          />
        </div>
        <div className="mt-12">
          <GoogleAuthButton
            onClick={() => console.log("Google auth button clicked")}
            authType="signup"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="ml-10 mt-6 flex justify-center">
        {/* TODO: This can be reused for signin? */}
        <footer>
          <h1 className="font-normal leading-7 text-xs">
            Already have an account?{" "}
            <a
              href="/login"
              className="lightBlueGreenTealHyperlink font-bold text-xs"
            >
              Login here
            </a>
          </h1>
        </footer>
      </div>
    </div>
  );
}
