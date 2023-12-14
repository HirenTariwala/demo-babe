import { Box, Button, Card } from '@mui/material';
import React from 'react';
// import Image from 'next/image';
// import Typography from '@/components/atoms/typography';
// import { useUserStore } from '@/store/reducers/users-reducer';
// import { Helper } from '@/utility/helper';
import Chip from '@/components/atoms/chip';
// import Image from 'next/image';
import NextImage from '@/components/atoms/image';

interface Props {
  index: number;
}

function DummyCard({ index }: Props) {
  //   const { currentUser } = useUserStore();

  return (
    <Card
      key={index}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 256,
        aspectRatio: { xs: '1/2', md: '3/5' },
        maxHeight: '384px',
        boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.20)',
        // background: `url("${PremiumBg}")`,  marginLeft: "4px",
        borderRadius: '16px',
        backgroundSize: 'cover',
        p: '24px',
      }}
    >
      <Box flex={1} display={'flex'} alignItems={'center'}>
        <Chip
          label="Private Profile"
          icon={
            <NextImage width={24} height={24} src={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/padlock.png`} alt="" />
          }
          sx={{
            color: '#fff',
            mx: 'auto',
            fontSize: { xs: '14px', md: '16px' },
            borderRadius: '100px',
            fontWeight: '500',
            height: 'auto',
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.20)',
          }}
        />
      </Box>
      <Button
        sx={{
          borderRadius: '100px',
          boxShadow: 'none',
          fontSize: { xs: '14px', md: '16px' },
          ':hover': {
            boxShadow: 'none',
          },
          textTransform: 'none',
          py: '12px',
        }}
        variant="contained"
      >
        Upgrade
      </Button>
    </Card>
  );
}

export default DummyCard;
