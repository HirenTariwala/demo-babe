import Box, { IBox } from '@/components/atoms/box';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import Typography from '@/components/atoms/typography';
import React from 'react';

interface ITransactionAmount extends IBox {
  amount: number | any;
}

const TransactionAmount = ({ color, fontSize, fontWeight, amount, ...props }: ITransactionAmount) => {
  return (
    <Box display="flex" alignItems="center" gap={2} {...props}>
      <Typography variant="h4" component="span" color={color} fontWeight={fontWeight} fontSize={fontSize}>
        {amount ? `${(amount / 100).toFixed(2)}` : `${amount}.00`}
      </Typography>
      <PriceLogo size={24} />
    </Box>
  );
};

export default TransactionAmount;
