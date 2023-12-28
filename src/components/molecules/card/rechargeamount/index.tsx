import Box, { IBox } from '@/components/atoms/box';
import React from 'react';
import TransactionAmount from '../../content/transaction';
import StatusTag from '@/components/atoms/chip/statustags';
import { getColor } from '@/common/utils/getcolor';
import Typography from '@/components/atoms/typography';

interface IRechargeAmount extends IBox {
  discount: number;
  fontSize: number;
  fontWeight: number;
  amount: number;
  isActive: boolean;
  size?: 'small' | 'large';
}

const RechargeAmount = ({
  fontSize,
  size,
  fontWeight,
  color,
  discount,
  amount,
  isActive,
  ...props
}: IRechargeAmount) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={size === 'small' ? '24px 20px' : '32px 20px'}
      flexDirection="column"
      gap={6}
      border={isActive ? '3px solid #FFD443' : '1px solid #CCC'}
      borderRadius={4}
      width={'100%'}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          border: '3px solid #FFD443',
        },
      }}
      {...props}
    >
      <Box display="flex" alignItems="center" flexDirection="column" gap={1}>
        <TransactionAmount
          amount={amount}
          flexDirection="row-reverse"
          fontSize={size === 'small' ? 20 : 28}
          fontWeight={500}
          color={color}
        />
        <StatusTag
          size="small"
          label={
            <Typography variant="subtitle2" component="span" fontWeight={fontWeight} fontSize={fontSize}>
              {`+${discount * 100}% Credit`}
            </Typography>
          }
          style={getColor('info')}
          sx={{ borderRadius: '100px' }}
        />
      </Box>
      <Typography component="span">{`$ ${(((amount ?? 0) / 100) * (1.0 - discount)).toFixed(2)} USD`}</Typography>
    </Box>
  );
};

export default RechargeAmount;
