"use client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import styles from "./styles.module.css";

export default function SignupForm() {
  const [signupFields, setSignupFields] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  return (
    <div className={`${styles.header} mt-6`}>
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
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full h-12 px-3 faintGreyInputColor"
              onChange={(e) => {
                setSignupFields({
                  ...signupFields,
                  username: e.target.value,
                });
              }}
            />
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full h-12 px-3 faintGreyInputColor"
              onChange={(e) => {
                setSignupFields({
                  ...signupFields,
                  email: e.target.value,
                });
              }}
            />
            <PasswordInputField
              id="password1"
              name="password1"
              placeholder="Enter password"
              onInputChanged={(value) => {
                setSignupFields({
                  ...signupFields,
                  password1: value,
                });
              }}
            />
            <PasswordInputField
              id="password2"
              name="password2"
              placeholder="Confirm password"
              onInputChanged={(value) => {
                setSignupFields({
                  ...signupFields,
                  password2: value,
                });
              }}
            />
          </div>
        </form>
      </div>
      <div className="text-center  mt-6">
        <div>
          <Button
            variant="contained"
            color="primary"
            className={`w-full h-12 mt-6 ${styles.submitButton}`}
            onClick={() => console.log(signupFields)}
            sx={{
              textTransform: "none",
              fontFamily: "Verdana, sans-serif",
              fontWeight: "700",
              borderRadius: "60px",
              width: "315px",
              boxShadow: "none",
            }}
          >
            Sign Up
          </Button>
        </div>
        <div className="mt-12">
          <Button
            variant="contained"
            color="secondary"
            className={`w-full h-12 signUpWithGoogleButtonColor`}
            startIcon={
              <Image
                src="/images/google-auth-logo/google-auth-logo.svg"
                alt="google"
                width={16}
                height={16}
              />
            }
            sx={{
              textTransform: "none",
              fontFamily: "Verdana, sans-serif",
              fontWeight: "700",
              borderRadius: "60px",
              width: "315px",
              boxShadow: "none",
            }}
          >
            Or Sign up with Google
          </Button>
        </div>
      </div>
      <div className="ml-10 mt-6 flex justify-center">
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

// This is a MUI input field, making it easier to add the input adornments
const PasswordInputField = ({
  id,
  name,
  placeholder,
  onInputChanged,
}: {
  id: string;
  name: string;
  placeholder: string;
  onInputChanged?: (value: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false); // toggles whether the password is visible in a text input field

  return (
    <TextField
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      className="w-full px-3 faintGreyInputColor"
      onChange={(e) => onInputChanged && onInputChanged(e.target.value)}
      sx={{
        marginTop: "4px",
        marginBottom: "4px",
        "&&& input": {
          height: "16px",
        },
        "& fieldset": { border: "none" }, // Removes the default border from MaterialUi TextField
        "&:focus-within fieldset, &:focus-visible fieldset": {
          border: "1.9px solid black !important", // Adds a black border when the input is focused
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <button
              className="focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Visibility sx={{ height: "16px", width: "auto" }} />
              ) : (
                <VisibilityOff sx={{ height: "16px", width: "auto" }} />
              )}
            </button>
          </InputAdornment>
        ),
      }}
    />
  );
};
