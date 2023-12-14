import React from 'react';
import Skeleton from '../Skeleton';

interface ISkeletonLine {
  width: number | string;
  height: number | string;
}

const SkeletonLine = ({ width, height, ...props }: ISkeletonLine) => {
  return (
    <Skeleton
      animation="wave"
      variant="circular"
      sx={{
        borderRadius: '100px',
      }}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default SkeletonLine;
