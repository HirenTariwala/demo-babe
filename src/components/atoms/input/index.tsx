import { StandardTextFieldProps, TextField } from "@mui/material";
import React from "react";

interface InputInterface extends StandardTextFieldProps {}

const Input = ({ ...props }: InputInterface) => {
  return (
    <TextField
      {...props}
    />
  );
};

export default Input;
