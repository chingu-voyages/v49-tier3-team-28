import { Button } from "@mui/material";

interface BasicRoundedButtonProps {
  label: string;
  onClick?: () => void;
  buttonClassNames?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  customMaterialButtonStyles?: object;
}

// Reusable button with rounded corners, default is orange background, but can be customized with classNames
export function BasicRoundedButton({
  label,
  onClick,
  buttonClassNames,
  startIcon,
  endIcon,
  disabled,
  customMaterialButtonStyles,
}: BasicRoundedButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      className={`w-full h-12  ${buttonClassNames}`}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      sx={{
        textTransform: "none",
        fontFamily: "Verdana, sans-serif",
        fontWeight: "700",
        borderRadius: "60px",
        width: "315px",
        boxShadow: "none",
        ...customMaterialButtonStyles,
      }}
    >
      {label}
    </Button>
  );
}
