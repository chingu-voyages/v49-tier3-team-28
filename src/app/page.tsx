// This is the title page of the application "/
import { AppNameTextLogo } from "@/components/App-name-text-logo/App-name-text-logo";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import Link from "next/link";
import BackgroundTitleSplash from "../../public/images/title-page/title-page-splash.png";
import moduleStyles from "./home-page.module.css";

export default function TitlePage() {
  return (
    <div
      className="flex flex-col items-center gap-y-36 justify-center w-screen h-screen bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${BackgroundTitleSplash.src})`,
      }}
    >
      <AppNameTextLogo />
      {/* Signup, signin buttons */}
      <div className="flex flex-col gap-y-9">
        <div>
          <Link href="/signup">
            <BasicRoundedButton
              label="Sign up"
              buttonClassNames={`${moduleStyles.whiteSignUpButton}`}
            />
          </Link>
        </div>
        <div>
          <Link href="/signin">
            <BasicRoundedButton
              label="Sign in"
              buttonClassNames={moduleStyles.signInButton}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
