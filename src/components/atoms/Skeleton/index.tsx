import React from 'react';
import { Skeleton as MuiSkeleton, SkeletonProps } from '@mui/material';

interface ISkeleton extends SkeletonProps {}

const Skeleton = ({ ...props }: ISkeleton) => {
  return <MuiSkeleton {...props} />;
};

export default Skeleton;
