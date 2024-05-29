// Resuable stylized text logo for the app name
import { Rowdies } from "next/font/google";
import moduleStyles from "./style.module.css";

const rowdies = Rowdies({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export function AppNameTextLogo({ customClasses }: { customClasses?: string }) {
  return (
    <div>
      <h1
        className={`${rowdies.className} ${moduleStyles.titleLogo} text-5xl leading-6 ${customClasses}`}
      >
        FitFlex
      </h1>
    </div>
  );
}
