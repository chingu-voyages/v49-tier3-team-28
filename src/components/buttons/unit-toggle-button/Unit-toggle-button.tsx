import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface ColorToggleButtonProps {
  onChange: () => void;
  alignment: string;
  leftLabel: string;
  rightLabel: string;
  leftValue: string;
  rightValue: string;
}

export function ColorToggleButton({
  onChange,
  alignment,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
}: ColorToggleButtonProps) {
  return (
    <ToggleButtonGroup
      color="success"
      value={alignment}
      exclusive
      onChange={onChange}
      sx={{
        "& .MuiButtonBase-root": {
          textTransform: "none",
        },
      }}
    >
      <ToggleButton value={leftValue}>{leftLabel}</ToggleButton>
      <ToggleButton value={rightValue}>{rightLabel}</ToggleButton>
    </ToggleButtonGroup>
  );
}
