import React from "react";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { FormControlLabel } from "@mui/material";

interface IToggle extends SwitchProps {
  label?: React.ReactNode 
}

const IOSSwitch = styled((props: SwitchProps) => (
    
<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ color, theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: color === 'primary' ? theme.palette.primary : "#BDFACB",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color:  "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.primary,
      backgroundColor: color === 'primary' ? theme.palette.secondary : '#F0F0F3',
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    backgroundColor: color === 'primary' ? theme.palette.secondary : '#F0F0F3',
  },
}));

const Toggle = ({label, ...props }: IToggle) => {
  return   <FormControlLabel
  control={<IOSSwitch {...props}/>}
  label={label}
/>
};

export default Toggle;
