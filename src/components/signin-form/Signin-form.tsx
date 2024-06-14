"use client";

import { AuthClient } from "@/app/clients/auth-client/auth-client";
import { signinFormValidator } from "@/app/validators/signin/signin-form.validator";
import { extractValidationErrors } from "@/app/validators/utils/extract-validation-errors/extract-validation-errors";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { CircularProgress, FormControlLabel, Switch } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import { GoogleAuthButton } from "../buttons/google-auth-button/Google-auth-button";
import { PasswordInputField } from "../input-fields/password-input-field/Password-input-field";
import { FormTextInputField } from "../input-fields/text-input-field/Form-text-input-field";

export function SigninForm() {
  const [formFieldValues, setFormFieldValues] = useState({
    email: "",
    password: "",
  });

  const formFieldErrorsInitialState = {
    email: { error: false, message: "" },
    password: { error: false, message: "" },
  };

  const router = useRouter();

  const [formFieldErrors, setFormFieldErrors] = useState<
    Record<string, { error: boolean; message: string }>
  >(formFieldErrorsInitialState);

  const [isLoading, setIsLoading] = useState(false);

  const [appError, setAppError] = useState({
    error: false,
    message: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/user/home");
    }
  }, []);

  const allFormFieldsValid = (displayErrors: boolean = true): boolean => {
    try {
      signinFormValidator.validateSync(formFieldValues, { abortEarly: false });
    } catch (error) {
      if (displayErrors) {
        const errors = extractValidationErrors(error);
        setFormFieldErrors(errors);
      }
      return false;
    }
    return true;
  };

  const clearValidationErrors = () => {
    setFormFieldErrors(formFieldErrorsInitialState);
  };

  const signInUser = async () => {
    if (!allFormFieldsValid()) return;

    setIsLoading(true);

    const res = await AuthClient.signInUser({
      email: formFieldValues.email,
      password: formFieldValues.password,
      callbackUrl: "/user/home", // User is redirected to the landing (home) page once they are signed in.
      redirect: false,
    });

    // If there is an error, set the error state and abort
    if (!res.success) {
      setAppError({ error: true, message: res.errorMessage! });
      setIsLoading(false);
      return;
    }

    // If all is good redirect to the redirect url
    router.push(res.redirectUrl!);
    setIsLoading(false);
  };

  const signInUserWithGoogle = async () => {
    setIsLoading(true);
    await AuthClient.signInWithGoogle();
    setIsLoading(false);
  };

  const { status } = useAuthSession();

  return (
    <div className="mt-6">
      <h1
        className={
          "font-bold openSansFont leading-7 text-2xl uppercase mt-14 pl-5"
        }
      >
        Welcome back!
      </h1>
      <div>
        <h2 className="font-normal leading-7 text-sm pl-5 robotoFont">
          Sign in to continue your journey
        </h2>
      </div>
      <div className="mt-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-elements flex flex-col justify-between gap-y-3 p-5">
            <FormTextInputField
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              error={formFieldErrors.email?.error}
              helperText={formFieldErrors.email?.message}
              disabled={isLoading}
              maxLength={50}
              onBlur={() => {
                clearValidationErrors();
                allFormFieldsValid();
              }}
              onChange={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  email: value,
                });
              }}
              inputProps={{
                autoCapitalize: "off",
                "aria-autocomplete": "none",
              }}
            />
            <PasswordInputField
              id="password"
              name="password"
              placeholder="Enter password"
              error={formFieldErrors.password?.error}
              helperText={formFieldErrors.password?.message}
              disabled={isLoading}
              maxLength={50}
              onBlur={() => {
                clearValidationErrors();
                allFormFieldsValid();
              }}
              onInputChanged={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  password: value,
                });
              }}
            />
            {/* Remember me toggle and forgot password link */}
            <div className="flex justify-between">
              <div>
                <FormControlLabel
                  sx={{
                    // This materialUI customization is needed to style the switch's label text
                    "& .MuiTypography-root": {
                      fontSize: "12px",
                      lineHeight: "20px",
                    },
                  }}
                  control={
                    <Switch inputProps={{ "aria-label": "Remember me" }} />
                  }
                  label="Remember me"
                />
              </div>
              <div className="self-center">
                <Link
                  href="/forgot-password"
                  className="lightBlueGreenTealHyperlink leading-5 font-normal text-xs"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
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
            label="Sign in"
            onClick={signInUser}
            disabled={isLoading || !allFormFieldsValid(false)}
            buttonClassNames="defaultButtonColor"
          />
        </div>
        <div className="mt-12">
          <GoogleAuthButton
            onClick={signInUserWithGoogle}
            authType="signin"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="ml-10 mt-6 flex justify-center">
        <footer>
          <h1 className="font-normal leading-7 text-xs">
            New to our site?{" "}
            <Link
              href="/signup"
              className="lightBlueGreenTealHyperlink font-bold text-xs"
            >
              Sign up now
            </Link>
          </h1>
        </footer>
      </div>
    </div>
  );
}
