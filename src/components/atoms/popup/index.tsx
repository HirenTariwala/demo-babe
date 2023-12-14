import React from "react";
import { MenuItemProps, MenuItem as MuiMenuItem } from "@mui/material";

interface IMenuItem extends MenuItemProps {
}

const MenuItem = ({ children, ...props }: IMenuItem) => {
  return <MuiMenuItem {...props}>{children}</MuiMenuItem>;
};

export default MenuItem;
