// Front end form validation for the signin form

import { object, string } from "yup";

export const signinFormValidator = object({
  password: string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),
  email: string()
    .email("Email must be a valid email")
    .required("Email is required"),
});
