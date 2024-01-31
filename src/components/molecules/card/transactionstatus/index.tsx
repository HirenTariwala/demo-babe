import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import React, { memo, useContext, useEffect, useState } from 'react';
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
import {
  babeUIDKey,
  clientUIDKey,
  idKey,
  infoKey,
  priceKey,
  shortLinkKey,
  statusKey,
  timeStampKey,
} from '@/keys/firestoreKeys';
import { OrderStatusEnum } from '@/enum/orderEnum';
import { getColor } from '@/common/utils/getcolor';
import ViewOrderModal from '@/components/page/Order/components/viewOrderModal';
import ReviewModal from '@/components/page/Order/components/reviewModal';
import RefundModal from '@/components/page/Order/components/refundModal';
import { ListChildComponentProps } from 'react-window';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';
import { Helper } from '@/utility/helper';
import { VariableWindowListContext } from '@/components/organisms/list/VariableWindowList';
import CountDown from '@/components/page/Login/Form/Timer/CountDown';
import { useRouter } from 'next/navigation';
import RefundRequestSubmittedModal from '@/components/page/Order/components/RefundRequestSubmittedModal';
import LoadingIcon from '@/components/atoms/icons/loading';
import { useTranslations } from 'next-intl';

const TransactionStatusCard = (isAdmin: boolean | null, hasMore: boolean, loading: boolean) =>
  // eslint-disable-next-line react/display-name
  memo(({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[] | undefined>) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const t = useTranslations('orderPage');
    const router = useRouter();
    const isLastIndex = index === (data ? data?.length - 1 : 0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
    const [refundModalOpen, setRefundModalOpen] = useState<boolean>(false);
    const [hasExpired, setExpired] = useState<boolean>(false);
    const [isOpenRefundRequestSubmittedDialog, setIsOpenRefundRequestSubmittedDialog] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setLoading] = useState<boolean>(false);
    const userStore = useUserStore();
    const { size, setSize } = useContext(VariableWindowListContext);
    const doc = data?.[index]?.data();

    const time = dayjs(Helper?.timeStempToDate(doc?.t)).format('MMM DD, hh:mm A');
    const price = doc?.[priceKey] || 0;
    const getStatus = (item: number) => {
      switch (item) {
        case OrderStatusEnum?.completed: {
          return { status: 'Completed' };
        }
        case OrderStatusEnum?.cancel: {
          return { status: 'Cancelled' };
        }
        case OrderStatusEnum?.error: {
          return { status: 'Cancelled' };
        }
        case OrderStatusEnum?.pending: {
          if (!hasExpired) {
            return { status: 'Pending' };
          } else return { status: 'Expired' };
        }
        case OrderStatusEnum?.pending_refund: {
          return { status: 'Pending Refund' };
        }
        case OrderStatusEnum?.refund_rejected: {
          return { status: 'Refund Rejected' };
        }
        case OrderStatusEnum?.refunded: {
          return { status: 'Refunded' };
        }
        case OrderStatusEnum?.rejected: {
          return { status: 'Rejected' };
        }
        case OrderStatusEnum?.unsuccessful: {
          return { status: 'Unsuccessful' };
        }
        default: {
          return { status: 'All', color: 'primary' };
        }
      }
    };
    const statusWithColorObj = getStatus(doc?.st);
    const currentUser = userStore?.currentUser;

    const [myUID] = [currentUser?.uid];
    const open = Boolean(anchorEl);

    const color: any = {
      Completed: 'success',
      Cancelled: 'error',
      Expired: 'primary',
      Pending: 'warning',
      Refunded: 'error',
      PendingRefund: 'warning',
    };

    const status = statusWithColorObj?.status;
    const isPaid = status?.toLowerCase() === 'pending' ? false : true;
    const timeStamp = doc?.[timeStampKey];
    const userInfo = doc?.[infoKey];
    const statusEnum = doc?.[statusKey];
    const isClient = doc?.[clientUIDKey] === myUID;
    const uid = isClient ? doc?.[babeUIDKey] : doc?.[clientUIDKey];
    const link = userInfo?.[uid]?.[shortLinkKey];

    useEffect(() => {
      const root = document.getElementById(index?.toString());
      const height = root?.getBoundingClientRect().height ?? 0;

      setSize?.(index, height);
    }, [size?.width]);
    if (!doc) return null;
    let currentObj: any = '';

    if (isAdmin) {
      currentObj = doc?.inf?.[doc?.[clientUIDKey]];
    } else {
      currentObj = doc?.inf?.[doc?.[babeUIDKey]];
    }
    const name = currentObj?.nick || '--';
    const profilePic = currentObj?.u || '';

    return (
      <Box
        key={index}
        style={style}
        sx={{
          marginTop: `${index * 20}px`,
        }}
      >
        <Card
          id={index?.toString()}
          sx={{
            p: isMobile ? 3 : 4,
            maxWidth: '688px',
            borderRadius: 4,
            minWidth: '343px',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box display="flex" flexDirection="column" gap={4}>
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
                      onClick={() => router.push(`/checkout?id=${doc?.[idKey]}`)}
                      sx={{
                        fontSize: 14,
                        lineHeight: '20px',
                        width: 'fit-content',
                      }}
                    >
                      {t('btnPayNow')}
                    </Button>
                  )}
                  <Box display="flex" alignItems="center" gap={4}>
                    <TransactionAmount amount={price} fontWeight={500} color={'#1A1A1A'} />
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
                        onClick={() => {
                          setIsOpen(true);
                          setAnchorEl(null);
                        }}
                      >
                        {t('menuViewOrder')}
                      </MenuItem>

                      {!['Expired', 'Pending', 'Cancelled'].includes(status) && (
                        <MenuItem
                          onClick={() => {
                            setReviewModalOpen(true);
                            setAnchorEl(null);
                          }}
                        >
                          {t('menuGiveReview')}
                        </MenuItem>
                      )}
                      {/* 
                      {requestRefundBy?.includes(myUID ?? '') && rejectedRefundReason && (
                        <MenuItem
                          disabled={isLoading}
                          onClick={() => {
                            // setOpenDialogType('Refund Rejection');
                            setRefundModalOpen(true);
                          }}
                        >
                          Refund
                        </MenuItem>
                      )} */}

                      {/* {isAdmin && (
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
                      )} */}

                      {/* {requestedRefund && isAdmin && (
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
                      )} */}

                      {(statusEnum === OrderStatusEnum.completed ||
                        statusEnum === OrderStatusEnum.pending_refund ||
                        statusEnum === OrderStatusEnum.refund_rejected) && (
                        <MenuItem
                          disabled={isLoading}
                          onClick={() => {
                            setRefundModalOpen(true);
                            setAnchorEl(null);
                            // setOpenDialogType('Request Refund');
                            // window.open(`/refund?id=${transactionID}&v=${version}`, '_blank');
                          }}
                        >
                          {t('menuRequestRefund')}
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
                    whiteSpace="nowrap"
                    fontSize={12}
                    lineHeight={'16px'}
                  >{`Order ID: ${doc?.[idKey]} `}</Typography>
                  {statusEnum === OrderStatusEnum.completed && !isMobile && <DotIcon />}
                  {!['expired', 'cancelled'].includes(status) && (
                    <>
                      {statusEnum === OrderStatusEnum.completed ? (
                        <Typography
                          variant="subtitle2"
                          color={'#999999'}
                          whiteSpace="nowrap"
                          fontSize={12}
                          lineHeight={'16px'}
                        >
                          {t('paidByCredit')}
                        </Typography>
                      ) : statusEnum === OrderStatusEnum.pending && !hasExpired ? (
                        <Typography
                          variant="subtitle2"
                          color={'error'}
                          fontSize={12}
                          whiteSpace="nowrap"
                          lineHeight={'16px'}
                          fontWeight={500}
                        >
                          {t('makePaymentText')} {''}
                          <CountDown
                            hasExpired={() => {
                              setExpired(true);
                            }}
                            minutesToExpire={Helper?.minutesToExpire()}
                            date={timeStamp?.toDate()}
                          />
                        </Typography>
                      ) : undefined}
                    </>
                  )}
                  {status === 'Completed' && <CoinsSwapIcon />}
                </Box>
              </Box>
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
              {t('noMore')}
            </Typography>
          </Box>
        )}
        <ViewOrderModal
          isMobile={isMobile}
          isTablet={isMobile}
          isOpen={isOpen}
          setOpen={setIsOpen}
          orderDeatils={{
            service: doc?.services?.details,
            details: {
              name: name,
              profile: profilePic,
              status: status,
              chatRoomId: doc.cri,
              messageID: doc.mid,
              price: price,
            },
          }}
        />
        <ReviewModal
          isMobile={isMobile}
          isTablet={isMobile}
          isOpen={reviewModalOpen}
          setOpen={setReviewModalOpen}
          babeDetails={{ name: name, profile: profilePic, reviewLink: link, myUID: myUID, currentUserName: name }}
        />
        <RefundModal
          isMobile={isMobile}
          isTablet={isMobile}
          isOpen={refundModalOpen}
          setOpen={setRefundModalOpen}
          orderId={doc?.[idKey]}
          myUid={myUID}
          orderDetails={{
            service: doc?.services?.details,
            details: {
              name: name,
              profile: profilePic,
              status: status,
              chatRoomId: doc.cri,
              messageID: doc.mid,
              price: price / 100,
            },
          }}
          setIsOpenRefundRequestSubmittedDialog={setIsOpenRefundRequestSubmittedDialog}
        />
        <RefundRequestSubmittedModal
          open={isOpenRefundRequestSubmittedDialog}
          setIsOpenRefundRequestSubmittedDialog={setIsOpenRefundRequestSubmittedDialog}
        />
      </Box>
    );
  });

export default TransactionStatusCard;
