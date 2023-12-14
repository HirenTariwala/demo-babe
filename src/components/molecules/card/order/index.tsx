import Box, { IBox } from '@/components/atoms/box';
// import PriceLogo from '@/components/atoms/icons/price-logo';
import Typography from '@/components/atoms/typography';
import React, { useState } from 'react';
import Rating from '../../ratings';
import Price from '../../price';
import Button from '@/components/atoms/button';
import OrderEmeetIcon from '@/components/atoms/icons/emeetorder';
import { IconButton } from '@mui/material';
import EmeetIcon from '@/components/atoms/icons/emeetIcon';

interface IOrderCard extends IBox {
	size?: 'small' | 'large';
	emeetData: any;
	buttonLabel: string;
}

const OrderCard = ({ buttonLabel, emeetData, size, ...props }: IOrderCard) => {
	const [isExpend, setIsExpend] = useState(false);
	return (
		<Box
			display="flex"
			alignItems="center"
			p={isExpend ? 4 : '12px 16px'}
			bgcolor="#ECF7FE"
			border="1px solid rgba(158, 214, 250, 1)"
			borderRadius={3}
			width={!isExpend && size === 'small' ? 'fit-content' : 505}
			position="relative"
			maxWidth={size === 'small' ? 360 : 505}
			{...props}
		>
			<IconButton
				sx={{
					background: '#FFF',
					position: 'absolute',
					top: '-15px',
					right: '-15px',
					boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
				}}
				onClick={() => setIsExpend((prev) => !prev)}
			>
				{isExpend ? (
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M12 10L8 6L4 10" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				) : (
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M4 6L8 10L12 6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				)}
			</IconButton>
			<Box display="flex" alignItems="center" gap={3} flexWrap={isExpend && size === 'small' ? 'wrap' : 'nowrap'}>
				{isExpend && size !== 'small' ? <OrderEmeetIcon /> : <EmeetIcon />}
				<Box
					display="flex"
					alignItems={isExpend ? 'flex-start' : 'center'}
					flexDirection={isExpend ? 'column' : 'row'}
					width={isExpend ? 192 : 400}
					gap={isExpend ? 0 : 4}
				>
					<Typography variant={size === 'small' && !isExpend ? 'body1' : 'h4'} component="span" fontWeight={500}>
						E-meet
					</Typography>
					<Box
						display="flex"
						alignItems={isExpend ? 'flex-start' : 'center'}
						flexDirection={size === 'small' || !isExpend ? 'row' : 'column'}
						gap={isExpend ? 2 : 4}
					>
						<Rating ratingData={emeetData.rating} size="small" />
						<Price priceData={emeetData.priceLabel} mt={0} size="small" />
					</Box>
				</Box>
				{isExpend && (
					<Button
						variant="contained"
						sx={{
							width: 'fit-content',
							marginLeft: size === 'small' ? '40px' : 0,
						}}
					>
						{buttonLabel}
					</Button>
				)}
			</Box>
			<Box></Box>
		</Box>
	);
};

export default OrderCard;
