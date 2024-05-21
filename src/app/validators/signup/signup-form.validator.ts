// Front end form validation for the signup form

import { object, ref, string } from "yup";

export const signupFormValidator = object({
  username: string()
    .required("Username is required")
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must be at most 50 characters"),
  password1: string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),
  password2: string()
    .required("This field is required")
    .oneOf([ref("password1")], "Passwords must match"),
  email: string()
    .email("Email must be a valid email")
    .required("Email is required"),
});
