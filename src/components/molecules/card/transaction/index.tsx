import { getColor } from '@/common/utils/getcolor';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { Card, CardContent } from '@mui/material';
import React, { memo, useContext, useEffect, useState } from 'react';
import TransactionAmount from '../../content/transaction';
import Menu from '@/components/atoms/popup/menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@/components/atoms/popup';
import Chip from '@/components/atoms/chip';
import { ListChildComponentProps } from 'react-window';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';
import { Helper } from '@/utility/helper';
import { MovementEnum, OrderItemEnum } from '@/enum/orderEnum';
import { VariableWindowListContext } from '@/components/organisms/list/VariableWindowList';
import LoadingIcon from '@/components/atoms/icons/loading';

const TransactionCard = (loading: boolean, hasMore: boolean, onOpenToastWithMsg: (arg: string) => void) =>
  // eslint-disable-next-line react/display-name
  memo(({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[] | undefined>) => {
    const transactionObj = data?.[index];
    const isLastIndex = index === (data ? data?.length - 1 : 0);
    const doc = transactionObj?.data();
    const { size, setSize } = useContext(VariableWindowListContext);

    const getStatus = (item: number) => {
      switch (item) {
        case OrderItemEnum.custom_recharge: {
          return { status: 'Custom Recharge', color: 'info' };
        }

        case OrderItemEnum.bundle_recharge: {
          return { status: 'Bundle Recharge', color: 'info' };
        }

        case OrderItemEnum.refund: {
          return { status: 'Refunded', color: 'primary' };
        }
        case OrderItemEnum.credits_movement: {
          const movement = doc?.['mtw'] ?? 0;
          return movement === MovementEnum.income_to_cash
            ? { status: 'Withdrawn', color: 'error' }
            : { status: 'Moved from Pending', color: 'primary' };
        }
        case OrderItemEnum.transaction: {
          return doc?.amt > 0 ? { status: 'Earned', color: 'success' } : { status: 'Spend', color: 'error' };
        }

        default: {
          return { status: 'All', color: 'success' };
        }
      }
    };
    const date = dayjs(Helper?.timeStempToDate(doc?.t)).format('MMM DD, hh:mm A');
    const statusWithColorObj = getStatus(doc?.item);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const amount = doc?.amt || 0;
    const status = statusWithColorObj?.status;
    const color = statusWithColorObj?.color;
    const time = date;
    const transactionID = doc?.id;

    useEffect(() => {
      const root = document.getElementById(`${index?.toString()}-wallet`);
      const height = root?.getBoundingClientRect().height ?? 0;

      setSize?.(index, height);
    }, [size?.width]);

    if (!doc) return null;

    return (
      <Box
        key={index}
        style={style}
        sx={{
          marginTop: `${index * 20}px`,
        }}
      >
        <Card
          id={`${index?.toString()}-wallet`}
          sx={{
            p: 4,
            maxWidth: '688px',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box display="flex" flexDirection="column" gap={4}>
              <Box display="flex" gap={4} justifyContent="space-between" width="100%" alignItems="flex-start">
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2" fontWeight={500}>
                    {time}
                  </Typography>
                  <Chip
                    label={status}
                    sx={{
                      color: getColor(color || 'info'),
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
                    <MenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(transactionID);
                        setAnchorEl(null);
                        onOpenToastWithMsg('ID Copied');
                      }}
                      sx={{
                        minHeight: 'fit-content !important',
                      }}
                      key={0}
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
        {(hasMore || loading) && isLastIndex && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 0px',
            }}
          >
            <LoadingIcon />
          </Box>
        )}
        {!hasMore && isLastIndex && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 0px',
            }}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              No More Data
            </Typography>
          </Box>
        )}
      </Box>
    );
  });

export default TransactionCard;
