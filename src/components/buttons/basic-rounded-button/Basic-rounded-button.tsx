import { Button } from "@mui/material";

interface BasicRoundedButtonProps {
  label: string;
  onClick?: () => void;
  buttonClassNames?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// Reusable button with rounded corners, default is orange background, but can be customized with classNames
export function BasicRoundedButton({
  label,
  onClick,
  buttonClassNames,
  startIcon,
  endIcon,
}: BasicRoundedButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      className={`w-full h-12 defaultButtonColor ${buttonClassNames}`}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        textTransform: "none",
        fontFamily: "Verdana, sans-serif",
        fontWeight: "700",
        borderRadius: "60px",
        width: "315px",
        boxShadow: "none",
      }}
    >
      {label}
    </Button>
  );
}
