import Image from "next/image";
import { BasicRoundedButton } from "../basic-rounded-button/Basic-rounded-button";
import styles from "./styles.module.css";

// Resuable Google auth sign-in
export function GoogleAuthButton({
  onClick,
  authType, // signup or signin
  disabled,
}: {
  authType: "signin" | "signup";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <BasicRoundedButton
      label={`Or sign ${authType === "signup" ? "up" : "in"}  with Google`}
      buttonClassNames={styles.signUpWithGoogleButtonColor}
      onClick={onClick}
      disabled={disabled}
      startIcon={
        <Image
          src="/images/google-auth-logo/google-auth-logo.svg"
          alt="google"
          width={16}
          height={16}
        />
      }
    />
  );
}
