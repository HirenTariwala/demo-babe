import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps, FormControlLabel } from '@mui/material/';
// import Typography from '../typography';

interface CheckboxInterface extends CheckboxProps {
  label?: string | React.ReactNode;
}

const CheckBox = ({ label, ...props }: CheckboxInterface) => {
  return <FormControlLabel control={<MuiCheckbox {...props} />} label={label} />;
};

export default CheckBox;
