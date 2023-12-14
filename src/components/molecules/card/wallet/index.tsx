import ToolTip from '@/components/atoms/tooltip';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, SxProps } from '@mui/material';
import React from 'react';
import TransactionAmount from '../../content/transaction';
import InfoIcon from '@/components/atoms/icons/info';
import Box from '@/components/atoms/box';

interface IWallet {
  index: number;
  amount: number;
  label: string | React.ReactNode;
  tooltipTitle: string;
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
  onClick: (arg: number) => void;
}

const Wallet = ({ index, position, amount, label, tooltipTitle, sx, onClick }: IWallet) => {
  const handleClick = () => {
    if (onClick) {
      onClick(index);
    }
  };
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
        '&:hover': {
          border: '2px solid #FFD443',
          '& $MuiTypography-root': {
            color: 'red',
          },
        },
        ...sx,
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" component="span" fontWeight={500} color="#999">
            {label}
          </Typography>
          <ToolTip title={tooltipTitle} color="#999" placement={position}>
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
