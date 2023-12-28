import { getColor } from '@/common/utils/getcolor';
import Box, { IBox } from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { Card, CardContent } from '@mui/material';
import React, { useState } from 'react';
import TransactionAmount from '../../content/transaction';
import Menu from '@/components/atoms/popup/menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@/components/atoms/popup';
import Chip from '@/components/atoms/chip';
// import { dummy } from '@/common/utils/data';

interface ITransactionCard extends IBox {
  transactionData: any;
}

const TransactionCard = ({ transactionData, ...props }: ITransactionCard) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { time, transactionID, amount, status } = transactionData;
  return (
    <Card
      sx={{
        p: 4,
        maxWidth: '688px',
        borderRadius: 4,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" flexDirection="column" gap={4} {...props}>
          <Box display="flex" gap={4} justifyContent="space-between" width="100%" alignItems="flex-start">
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" fontWeight={500}>
                {time}
              </Typography>
              <Chip
                label={status}
                sx={{
                  color: getColor(transactionData?.color || 'info'),
                  padding: '6px 8px',
                  width: 'fit-content',
                  borderRadius: 3,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: '16px',
                }}
                size="small"
              />
            </Box>
            <Box display="flex" gap={4}>
              <TransactionAmount amount={amount} fontWeight={500} color={amount > 0 ? '#4CAF4F' : '#1A1A1A'} />
              <Menu
                open={open}
                setAnchorEl={setAnchorEl}
                onClose={() => setAnchorEl(null)}
                icon={<MoreVertIcon />}
                anchorEl={anchorEl}
                sx={{
                  '.MuiPaper-root': {
                    borderRadius: '12px',
                  },
                }}
              >
                {/* {dummy && dummy.map((item: any) => <MenuItem key={item.id}>{item.text}</MenuItem>)} */}
                <MenuItem
                  sx={{
                    minHeight: 'fit-content !important',
                  }}
                  key={0}
                  className="veer"
                >
                  {'Copy Id'}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Typography
            variant="subtitle2"
            color={'#999999'}
            fontSize={12}
            lineHeight={'16px'}
          >{`Transaction ID: ${transactionID} `}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
