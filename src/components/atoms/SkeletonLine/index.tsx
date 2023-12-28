import React from 'react';
import Skeleton from '../Skeleton';

interface ISkeletonLine {
  width: number | string;
  height: number | string;
  radius?: string | number;
}

const SkeletonLine = ({ width, height, radius = '100px', ...props }: ISkeletonLine) => {
  return (
    <Skeleton
      animation="wave"
      variant="circular"
      sx={{
        borderRadius: radius,
      }}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default SkeletonLine;
