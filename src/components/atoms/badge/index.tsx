import React from "react";
import { BadgeProps, Badge as MuiBadge } from "@mui/material";

interface IBadge extends BadgeProps {}

const Badge = ({ children, ...props }: IBadge) => {
  return <MuiBadge {...props}>{children}</MuiBadge>;
};

export default Badge;
