import { Skeleton } from '@mui/material';

export const SkeletonCardView = ({ ...props }) => {
	return (
		<Skeleton {...props} sx={{ width: '100%', height: "100%", borderRadius: 4 }} animation="wave" variant="rectangular" />
	);
};
