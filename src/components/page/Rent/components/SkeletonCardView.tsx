import { Skeleton } from '@mui/material';

interface ISkeleton {
  radius?: number | string;
}
export const SkeletonCardView = ({ radius = 4, ...props }: ISkeleton) => {
  return (
    <Skeleton
      {...props}
      sx={{ width: '100%', height: '100%', borderRadius: radius }}
      animation="wave"
      variant="rectangular"
    />
  );
};
