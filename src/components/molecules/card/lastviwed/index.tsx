import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, CardProps } from '@mui/material';
import React from 'react';

interface ILastViewdCard extends CardProps {
	viewedData: any;
	size?: 'small' | 'large';
	onClick: () => void;
}

const LastViewdCard = ({ onClick, size, viewedData, ...props }: ILastViewdCard) => {
	return (
		<Card
			sx={{
				p: 4,
				width: size === 'small' ? '343px' : '688px',
				borderRadius: 4,
			}}
			{...props}
		>
			<CardContent sx={{ p: 0 }}>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Box display="flex" gap={4}>
						<Avatar avatars={[{ alt: 'H', src: viewedData?.profilepic }]} />
						<Box display="flex" flexDirection="column" gap={1}>
							<Typography variant="body2" fontWeight={500}>
								{viewedData?.name}
							</Typography>
							<Typography variant="subtitle2" color={'#999999'}>{`Viewed ${viewedData?.time} min ago`}</Typography>
						</Box>
					</Box>
					{size === 'small' ? (
						<Box onClick={onClick}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									d="M9 18L15 12L9 6"
									stroke="#999999"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</Box>
					) : (
						<Button variant="outlined" sx={{ border: '1px solid #CCC' }} onClick={onClick}>
							View Profile
						</Button>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};

export default LastViewdCard;
