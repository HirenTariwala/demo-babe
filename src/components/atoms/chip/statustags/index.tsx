import React from 'react'
import { Chip, ChipProps } from '@mui/material';

interface IStatusTag extends ChipProps {}

const StatusTag = ({ ...props}:IStatusTag) => {
  return (
    <Chip {...props}/>
  )
}

export default StatusTag