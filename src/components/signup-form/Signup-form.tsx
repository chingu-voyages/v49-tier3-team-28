"use client";
import { signupFormValidator } from "@/app/validators/signup/signup-form.validator";
import { extractValidationErrors } from "@/app/validators/utils/extract-validation-errors/extract-validation-errors";
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

  const validateFormFields = () => {
    try {
      signupFormValidator.validateSync(formFieldValues, { abortEarly: false });
    } catch (error) {
      const errors = extractValidationErrors(error);
      setFormFieldErrors(errors);
    }
  };

  return (
    <div className={`mt-6`}>
      <h1 className={"font-bold leading-7 text-xl uppercase"}>
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
              onInputChanged={(value) => {
                setFormFieldValues({
                  ...formFieldValues,
                  password2: value,
                });
              }}
            />
          </div>
        </form>
      </div>
      <div className="text-center mt-6">
        <div>
          <BasicRoundedButton label="Sign up" onClick={validateFormFields} />
        </div>
        <div className="mt-12">
          <GoogleAuthButton
            onClick={() => console.log("Google auth button clicked")}
            authType="signup"
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
