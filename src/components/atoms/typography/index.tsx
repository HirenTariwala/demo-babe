"use client";
import React from "react";
import { Typography as MuiTypography, TypographyProps } from "@mui/material";

interface TypographyInterface extends TypographyProps {}

const Typography = ({ children, ...props }: TypographyInterface) => {
  return (
    <>
      <MuiTypography {...props}>{children}</MuiTypography>
    </>
  );
};

export default Typography;
