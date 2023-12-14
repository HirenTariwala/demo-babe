import Box, { IBox } from '@/components/atoms/box';
// import Button from '@/components/atoms/button';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import Typography from '@/components/atoms/typography';
import { Card, CardContent } from '@mui/material';
import React from 'react';
// import Rating from '../../ratings';

interface IBabeMessageCard extends IBox {
  headerData: any;
  children: React.ReactNode;
}

const BabeMessageCard = ({children,headerData,...props}: IBabeMessageCard) => {
  const {title,amount,orderId} = headerData
  return (
    <Card sx={{ borderRadius: 4, maxWidth: 400 }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          p="16px 0"
          bgcolor="#1A1A1A"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          gap={1}
          {...props}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <PriceLogo size={24} />
            <Typography
              variant="h4"
              component="span"
              fontWeight={500}
              color="#FFF"
            >
              {title}: {amount}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color={'#999999'}
          >{`Order ID: ${orderId} `}</Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default BabeMessageCard;
