import Box, { IBox } from '@/components/atoms/box';
import React from 'react';
import TransactionAmount from '../../content/transaction';
import StatusTag from '@/components/atoms/chip/statustags';
import { getColor } from '@/common/utils/getcolor';
import Typography from '@/components/atoms/typography';

interface IRechargeAmount extends IBox {
  price: number;
  credit: number;
  fontSize: number;
  fontWeight: number;
  size?: 'small' | 'large';
}

const RechargeAmount = ({
  credit,
  fontSize,
  size,
  fontWeight,
  color,
  price,
}: IRechargeAmount) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={size === 'small' ? '24px 20px' : '32px 20px'}
      flexDirection="column"
      gap={6}
      border="1px solid #CCC"
      borderRadius={4}
      width={288}
      sx={{
        '&:hover': {
          border: '2px solid #FFD443',
        },
      }}
    >
      <Box display="flex" alignItems="center" flexDirection="column" gap={1}>
        <TransactionAmount
          amount={250}
          flexDirection="row-reverse"
          fontSize={size === 'small' ? 20 : 28}
          fontWeight={500}
          color={color}
        />
        <StatusTag
          size="small"
          label={
            <Typography
              variant="subtitle2"
              component="span"
              fontWeight={fontWeight}
              fontSize={fontSize}
            >
              {`+${credit}% Credit`}
            </Typography>
          }
          style={getColor('info')}
          sx={{ borderRadius: '100px' }}
        />
      </Box>
      <Typography component="span">{`$ ${price} USD`}</Typography>
    </Box>
  );
};

export default RechargeAmount;
