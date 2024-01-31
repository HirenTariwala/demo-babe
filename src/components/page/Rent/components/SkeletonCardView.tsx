import { Skeleton, SkeletonProps } from '@mui/material';

interface ISkeleton extends SkeletonProps {
  radius?: number | string;
}
export const SkeletonCardView = ({ radius = 4, ...props }: ISkeleton) => {
  return (
    <Skeleton
      sx={{ width: '100%', height: '100%', borderRadius: radius, ...props.sx }}
      animation="wave"
      variant="rectangular"
      {...props}
    />
  );
};
