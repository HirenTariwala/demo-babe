import React from "react";
import {BoxProps, Box as MuiBox} from "@mui/material";

export interface IBox extends BoxProps {}

const Box = ({ children, ...props }: IBox) => {
  return <MuiBox {...props}>{children}</MuiBox>;
};

export default Box;
