/**
 * After yup validation is done, it outputs errors in a certain format. This function converts the format into something more useable
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
