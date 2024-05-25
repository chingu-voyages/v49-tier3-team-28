import { TextField } from "@mui/material";

// Reusable text field we can use in forms (for basic text and email inputs)
interface FormTextInputFieldProps {
  id?: string;
  type: "text" | "email";
  name: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

export function FormTextInputField({
  id,
  placeholder,
  type,
  name,
  onChange,
  helperText,
  error,
  disabled,
  onBlur,
  maxLength,
}: FormTextInputFieldProps) {
  return (
    <TextField
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full px-3 faintGreyInputColor"
      helperText={helperText}
      error={error}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      onBlur={onBlur}
      inputProps={{ maxLength }}
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
    />
  );
}
