import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import React from 'react';

interface IOrder {
  meals?: boolean;
  orderData: any;
}

const Order = ({ orderData, meals = false }: IOrder) => {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" fontWeight={500}>
          Date:{' '}
        </Typography>
        <Typography variant="body2" sx={{ color: '#999999' }}>
          {orderData.date}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" fontWeight={500}>
          Time:{' '}
        </Typography>
        <Typography variant="body2" sx={{ color: '#999999' }}>
          {orderData.time}
        </Typography>
      </Box>
      {meals && (
        <>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" fontWeight={500}>
              Venue:{' '}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              {orderData.venue}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" fontWeight={500}>
              Activity:{' '}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              {orderData.activity}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" fontWeight={500}>
              Cab fare:{' '}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              {orderData.fare}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Order;
