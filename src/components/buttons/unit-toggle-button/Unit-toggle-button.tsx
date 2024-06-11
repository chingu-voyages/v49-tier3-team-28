import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface ColorToggleButtonProps {
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => void;
  alignment: string;
  leftLabel: string;
  rightLabel: string;
  leftValue: string;
  rightValue: string;
}

const toggleButtonGroupSx: SxProps<Theme> = {
  "& .MuiToggleButton-root": {
    textTransform: "none",
    "&.Mui-selected": {
      backgroundColor: "#03BB9B",
      color: "white",
    },
  },
};

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
      value={alignment}
      exclusive
      onChange={onChange}
      sx={toggleButtonGroupSx}
    >
      <ToggleButton value={leftValue}>{leftLabel}</ToggleButton>
      <ToggleButton value={rightValue}>{rightLabel}</ToggleButton>
    </ToggleButtonGroup>
  );
}
