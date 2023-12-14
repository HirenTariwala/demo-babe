import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps, IconButton } from '@mui/material';

interface ITooltip extends TooltipProps {}

const ToolTip = ({ children, ...props }: ITooltip) => {
  return (
    <MuiTooltip arrow {...props}>
      <IconButton>{children}</IconButton>
    </MuiTooltip>
  );
};

export default ToolTip;
