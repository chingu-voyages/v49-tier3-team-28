"use client";

import { AppNameTextLogo } from "@/components/App-name-text-logo/App-name-text-logo";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import { motion } from "framer-motion";
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
      <motion.div
        className="flex flex-col gap-y-9"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/signup">
            <BasicRoundedButton
              label="Sign up"
              buttonClassNames={`${moduleStyles.whiteSignUpButton}`}
            />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link href="/signin">
            <BasicRoundedButton
              label="Sign in"
              buttonClassNames={moduleStyles.signInButton}
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
