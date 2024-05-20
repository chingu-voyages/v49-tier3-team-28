// This converts yup validation errors to be displayed in the form

/**
 *
 * @param errors This will taken in the errors from a yup validation schema and convert them to a format that can be displayed as form field errors
 * ex. { fieldName: { error: true, message: "This field is required" } }
 */
export function extractValidationErrors(
  errors: any
): Record<string, { error: boolean; message: string }> {
  let validationErrors: Record<string, { error: boolean; message: string }> =
    {};

  for (const error of errors.inner) {
    if (error.path) {
      validationErrors = {
        ...validationErrors,
        [error.path]: {
          error: true,
          message: error.message,
        },
      };
    }
  }
  return validationErrors;
}
