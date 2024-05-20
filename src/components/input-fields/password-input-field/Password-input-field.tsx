"use client";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

// Reusable form field for password inputs, which has an end adornment to toggle the visibility of the password
export const PasswordInputField = ({
  id,
  name,
  placeholder,
  onInputChanged,
  error,
  helperText,
}: {
  id: string;
  name: string;
  placeholder: string;
  error?: boolean;
  helperText?: string;
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
      error={error}
      helperText={helperText}
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
