// import { getColor } from '@/common/utils/getcolor';
import Box, { IBox } from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import TransactionAmount from '../../content/transaction';
import Menu from '@/components/atoms/popup/menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@/components/atoms/popup';
import Chip from '@/components/atoms/chip';
import Avatar from '@/components/atoms/avatar';
import CoinsSwapIcon from '@/components/atoms/icons/coinswapIcon';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Button from '@/components/atoms/button';
import { useUserStore } from '@/store/reducers/usersReducer';
import { infoKey, rejectReasonAfterKey, rejectReasonKey, statusKey, timeStampKey } from '@/keys/firestoreKeys';
import { DateHelper } from '@/utility/dateHelper';
import { OrderStatusEnum } from '@/enum/orderEnum';
import { getColor } from '@/common/utils/getcolor';

interface ITransactionStatusCard extends IBox {
  transactionStatusData: any;
  doc?: any | undefined;
  isAdmin?: boolean | null;
}

const TransactionStatusCard = ({ doc, isAdmin, transactionStatusData, ...props }: ITransactionStatusCard) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDialogType, setOpenDialogType] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;

  const [myUID] = [currentUser?.uid];
  const open = Boolean(anchorEl);
  const { profilePic, status, name, time, transactionID, amount, remainingTime } = transactionStatusData;

  const color: any = {
    Completed: 'success',
    Cancelled: 'error',
    Expired: 'primary',
    Pending: 'warning',
    Refunded: 'warning',
    PendingRefund: 'warning',
  };

  const isPaid = status?.toLowerCase() === 'pending' ? false : true;
  const requestRefundBy = Object.keys(doc[rejectReasonKey] ?? {});
  const rejectedRefundReason = doc[rejectReasonAfterKey];
  const timeStamp = doc[timeStampKey];
  const requestedRefund = doc[rejectReasonKey];
  const userInfo = doc[infoKey];
  const statusEnum = doc[statusKey];

  return (
    <Card
      sx={{
        p: isMobile ? 3 : 4,
        maxWidth: '688px',
        borderRadius: 4,
        minWidth: '343px',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" flexDirection="column" gap={4} {...props}>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gridTemplateRows="2fr 1fr" gap={4} width="100%">
            <Box display="flex" flexDirection="column" gap={4} alignItems="start">
              <Box display="flex" gap={4} alignItems="center">
                <Avatar
                  sx={{
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                  }}
                  avatars={[{ alt: 'H', src: profilePic }]}
                />
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2} flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={500}>
                      {name}
                    </Typography>
                    <Typography variant="subtitle2" color={'#999999'} fontSize={12} lineHeight={'16px'}>
                      {time}
                    </Typography>
                  </Box>
                  <Chip
                    label={status}
                    sx={{
                      color: getColor(color[status]),
                      padding: '6px 8px',
                      width: 'fit-content',
                      paddingLeft: 0,
                      paddingRight: 0,
                      borderRadius: 3,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: '16px',
                      height: 28,
                    }}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              gap={4}
              justifyContent={isMobile && isPaid ? 'center' : isMobile && !isPaid ? 'space-between' : 'flex-end'}
              alignItems={isMobile ? 'flex-end' : 'center'}
              flexDirection={isMobile ? 'column-reverse' : 'row'}
              height={!isMobile ? 52 : 'auto'}
              gridRow={isMobile && !isPaid ? 'span 2' : 'unset'}
            >
              {!isPaid && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: 14,
                    lineHeight: '20px',
                    width: 'fit-content',
                  }}
                >
                  Pay now
                </Button>
              )}
              <Box display="flex" alignItems="center" gap={4}>
                <TransactionAmount amount={amount} fontWeight={500} color={'#1A1A1A'} />
                <Menu
                  open={open}
                  setAnchorEl={setAnchorEl}
                  onClose={() => setAnchorEl(null)}
                  icon={<MoreVertIcon />}
                  anchorEl={anchorEl}
                  sx={{ '.MuiPaper-root': { borderRadius: 3 } }}
                >
                  {/* {dummy && dummy?.map((item) => <MenuItem key={item?.id}>{item?.text}</MenuItem>)} */}
                  <MenuItem
                  // onClick={viewOrder}
                  >
                    View order
                  </MenuItem>

                  <MenuItem
                  // onClick={leaveReview}
                  >
                    Give review
                  </MenuItem>

                  {requestRefundBy?.includes(myUID ?? '') && rejectedRefundReason && (
                    <MenuItem
                      disabled={isLoading}
                      onClick={() => {
                        setOpenDialogType('Refund Rejection');
                        setIsOpen(true);
                      }}
                    >
                      Refund rejected
                    </MenuItem>
                  )}

                  {isAdmin && (
                    <MenuItem
                      // disabled={isLoading}
                      sx={{ color: DateHelper?.getNumberOfHoursAgo(timeStamp.toDate()) > 72 ? 'red' : 'black' }}
                      onClick={() => {
                        setOpenDialogType('Issue Refund');
                        setIsOpen(true);
                      }}
                    >
                      Issue refund{' '}
                      {DateHelper.getNumberOfHoursAgo(timeStamp.toDate()) > 72 ? '(more than 72 hours)' : ''}
                    </MenuItem>
                  )}

                  {requestedRefund && isAdmin && (
                    <>
                      {Object.entries(requestedRefund).map((value, idx) => {
                        const userUUID = value[0];

                        return (
                          <MenuItem
                            key={idx}
                            disabled={isLoading}
                            onClick={() => {
                              setOpenDialogType('Reject');
                              setIsOpen(true);
                              // setRejectedWho(userUUID);
                              // setRejectDialog(true);
                            }}
                          >
                            Reject {userInfo?.[userUUID]?.nick}
                          </MenuItem>
                        );
                      })}
                    </>
                  )}

                  {(statusEnum === OrderStatusEnum.completed ||
                    statusEnum === OrderStatusEnum.pending_refund ||
                    statusEnum === OrderStatusEnum.refund_rejected) && (
                    <MenuItem
                      disabled={isLoading}
                      onClick={() => {
                        setOpenDialogType('Request Refund');
                        setIsOpen(true);
                        // window.open(`/refund?id=${transactionID}&v=${version}`, '_blank');
                      }}
                    >
                      Request Refund
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            </Box>
            <Box
              display="flex"
              gap={isMobile ? 1 : 2}
              gridColumn={isMobile && isPaid ? '1 / span 2' : 'unset'}
              alignItems="center"
              flexWrap={isMobile ? 'wrap' : 'nowrap'}
            >
              <Typography
                variant="subtitle2"
                color={'#999999'}
                fontSize={12}
                lineHeight={'16px'}
              >{`Order ID: ${transactionID} `}</Typography>
              {!['expired', 'cancelled'].includes(status) && !isMobile && <DotIcon />}
              {!['expired', 'cancelled'].includes(status) && (
                <>
                  {status?.toLowerCase() !== 'pending' ? (
                    <Typography variant="subtitle2" color={'#999999'} fontSize={12} lineHeight={'16px'}>
                      Paid by credit
                    </Typography>
                  ) : (
                    <Typography variant="subtitle2" color={'error'} fontSize={12} lineHeight={'16px'} fontWeight={500}>
                      Make payment in {remainingTime}
                    </Typography>
                  )}
                </>
              )}
              {status === 'Completed' && <CoinsSwapIcon />}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionStatusCard;
