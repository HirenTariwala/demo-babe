'use client';
import Box from '@/components/atoms/box';
import LogoIcon from '@/components/atoms/icons/logo';
import Typography from '@/components/atoms/typography';
import React from 'react';
import Form from './Form';
import useLoginHook from './Form/useLoginHook';
import LoadingIcon from '@/components/atoms/icons/loading';

const Login = () => {
	const { redirectLoading, isMobile } = useLoginHook();
	if (redirectLoading) {
		return (
			<Box
				width={'100%'}
				height={'100vh'}
				display={'flex'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<LoadingIcon />
			</Box>
		);
	}
	return (
		<Box
			width={'100%'}
			height={'100vh'}
			display="flex"
			justifyContent={isMobile ? 'flex-start' : 'center'}
			alignItems={isMobile ? 'flex-start' : 'center'}
		>
			<Box
				boxShadow={isMobile ? '' : '0px 2px 8px 0px rgba(0, 0, 0, 0.10)'}
				borderRadius={'24px'}
				maxWidth={'636px'}
				textAlign={'center'}
			>
				<Box display={'flex'} flexDirection={'column'} gap={6} padding={'40px'}>
					<Box>
						<LogoIcon size={isMobile ? 60 : 100} />
					</Box>

					<Form />

					<Box>
						<Typography
							color="#999"
							component="span"
							variant="body2"
							sx={{
								fontSize: isMobile ? '12px' : '14px',
							}}
						>
							By continuing, you agree to our{' '}
							<Typography
								color="#646464"
								component="span"
								sx={{
									fontSize: isMobile ? '12px' : '14px',
								}}
								variant="subtitle1"
							>
								Terms
							</Typography>{' '}
							and that you have read our
							<Typography
								color="#646464"
								component="span"
								sx={{
									fontSize: isMobile ? '12px' : '14px',
								}}
								variant="subtitle1"
							>
								{' '}
								Data Use Policy.{' '}
							</Typography>
						</Typography>
						<Box>
							<Typography
								color="#999"
								component="span"
								variant="body2"
								sx={{
									fontSize: isMobile ? '12px' : '14px',
								}}
							>
								Promoting illegal commercial activities is prohibited.
							</Typography>
						</Box>
					</Box>
					<Box id="recaptcha-container" />
				</Box>
			</Box>
		</Box>
	);
};

export default Login;
