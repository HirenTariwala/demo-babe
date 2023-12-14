import React from 'react'
import {  ChipProps, Chip as MuiChip } from '@mui/material';

interface IChip extends ChipProps {
  size?:'small' |'medium'
}

const Chip = ({size, ...props}:IChip) => {
  return (
    <MuiChip size={size} {...props}/>
  )
}


export default Chip