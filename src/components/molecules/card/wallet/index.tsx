import ToolTip from '@/components/atoms/tooltip';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, SxProps } from '@mui/material';
import React from 'react';
import TransactionAmount from '../../content/transaction';
import InfoIcon from '@/components/atoms/icons/info';
import Box from '@/components/atoms/box';

interface IWallet {
  amount: number | undefined;
  label: string | React.ReactNode;
  tooltipTitle: string | React.ReactNode;
  position:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'
    | undefined;
  sx: SxProps;
}

const Wallet = ({ position, amount, label, tooltipTitle, sx }: IWallet) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0px 2px 14px 0px rgba(0, 0, 0, 0.10)',

        // width: '252px',
        minWidth: '200px',
        maxWidth: '252px',
        display: 'flex',
        alignItems: 'center',
        border: '2px solid rgba(0, 0, 0, 0)',
        gap: 4,
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" component="span" fontWeight={500} color={'#1A1A1A'}>
            {label}
          </Typography>
          <ToolTip
            title={
              <Typography whiteSpace="pre-line" variant="body2" fontSize="12px">
                {tooltipTitle}
              </Typography>
            }
            color={'#1A1A1A'}
            sx={{
              whiteSpace: 'pre-line',
            }}
            placement={position}
          >
            <InfoIcon />
          </ToolTip>
        </Box>
        <TransactionAmount
          amount={amount}
          flexDirection="row-reverse"
          fontSize={24}
          fontWeight={500}
          width="fit-content"
        />
      </CardContent>
    </Card>
  );
};

export default Wallet;
