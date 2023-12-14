import React from 'react';
import Skeleton from '../Skeleton';

interface ISkeletonAvatar {
  width: number | string;
  height: number | string;
}

const SkeletonAvatar = ({ width, height, ...props }: ISkeletonAvatar) => {
  return <Skeleton animation="wave" variant="circular" width={width} height={height} {...props} />;
};

export default SkeletonAvatar;
