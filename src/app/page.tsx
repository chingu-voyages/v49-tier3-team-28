// This is the title page of the application "/
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { Rowdies } from "next/font/google";
import Link from "next/link";
import BackgroundTitleSplash from "../../public/images/title-page/title-page-splash.png";
import moduleStyles from "./home-page.module.css";

const rowdies = Rowdies({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export default function TitlePage() {
  return (
    <div
      className="flex flex-col items-center gap-y-36 justify-center w-screen h-screen bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${BackgroundTitleSplash.src})`,
      }}
    >
      <div>
        <h1
          className={`${rowdies.className} ${moduleStyles.titleLogo} text-5xl leading-6`}
        >
          FitFlex
        </h1>
      </div>
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
            <BasicRoundedButton label="Sign in" />
          </Link>
        </div>
      </div>
    </div>
  );
}
