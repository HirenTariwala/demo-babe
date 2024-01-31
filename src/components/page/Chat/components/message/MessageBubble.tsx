import { getColor } from '@/common/utils/getcolor';
import Box, { IBox } from '@/components/atoms/box';
import StatusTag from '@/components/atoms/chip/statustags';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import Button from '@/components/atoms/button';
import Avatar from '@/components/atoms/avatar';
import ProfileIcon from '@/components/atoms/icons/profile';
import { ServiceHelper } from '@/utility/serviceHelper';
import { ServiceDetails } from '@/props/servicesProps';
import { Helper } from '@/utility/helper';
import { CancelOrRejectEnum, option } from '@/enum/myEnum';
import { Timestamp, deleteField, doc, updateDoc } from 'firebase/firestore';
import { CancelRejectProps, ClubProps } from '@/props/commonProps';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/reducers/usersReducer';
import { db, functions } from '@/credentials/firebase';
import {
  CONVERSATION,
  MESSAGES,
  chatRoomIdKey,
  messageIdKey,
  payLinkKey,
  rejectReasonKey,
  statusKey,
} from '@/keys/firestoreKeys';
import { useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions';
import { stripeCheckOutV6Function } from '@/keys/functionNames';
import Order from '@/components/molecules/content/order';
import { useAppDispatch } from '@/store/useReduxHook';
import { setSelectedConversation } from '@/store/reducers/conversationReducer';
import { setIsOpenChatDrawer, useDrawerOpenStore } from '@/store/reducers/drawerOpenReducer';
import { extractKeyValuePairs } from '@/common/utils/data';

const color: any = {
  ['Payment success']: 'success',
  Cancelled: 'error',
  Expired: 'error',
  ['New request']: 'warning',
  Rejected: 'error',
  ['Waiting for payment']: 'warning',
  ['Waiting for response']: 'warning',
};

interface IMessageBubble extends IBox {
  babeUID: string | undefined;
  babeProfileImage: string | undefined;
  clientProfileImage: string | undefined;
  sender: string | undefined;
  showProfileImage: boolean;
  index: number;
  chatRoomID: string;
  messageId: string;
  msg: string;
  msgArr: string[];
  isMine: boolean;
  date: Date;
  seen: boolean;
  createdAt: Timestamp;
  status: option;
  rejectedReason?: string;
  order: any;
  link: string | undefined;
  serviceDetails?: ServiceDetails | undefined;
  club?: ClubProps | undefined;
  requestNewOrder: () => void;
  openUnVerifiedModalHandler: () => void;
  onRejectCancel: (data: CancelRejectProps) => void;
}

const MessageBubble = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  babeUID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  babeProfileImage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clientProfileImage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sender,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showProfileImage,
  status,
  rejectedReason,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
  chatRoomID,
  messageId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  seen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  msg,
  msgArr,
  isMine,
  date,
  createdAt,
  order,
  link,
  serviceDetails,
  club,
  requestNewOrder,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openUnVerifiedModalHandler,
  onRejectCancel,
  ...props
}: IMessageBubble) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isOpenChatDrawer } = useDrawerOpenStore();
  const { currentUser } = useUserStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAdmin, myNickname, verified] = [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentUser?.isAdmin || currentUser?.a,
    currentUser?.nickname || currentUser?.nick,
    currentUser?.verified,
  ];

  const [payLink, setPayLink] = useState<string | undefined>(link);

  const today = new Date();
  const diffMs = today.getTime() - createdAt.toDate().getTime();
  const diffMins = Math.round(diffMs / 60000);

  const isPending = status === option.pending;

  const [counter, setCounter] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasExpired, setExpired] = useState<boolean>(diffMins > Helper?.minutesToExpire());

  const [loadingAccept, setAccept] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alert, setAlert] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alertMsg, setMsg] = useState<string>();

  const openAlert = (msg: string) => {
    setAlert(true);
    setMsg(msg);
  };

  const revertToAcceptReject = async () => {
    setAccept(true);

    await updateDoc(doc(db, CONVERSATION, chatRoomID, MESSAGES, messageId), {
      [statusKey]: option.pending,
      [rejectReasonKey]: deleteField(),
    });

    setAccept(false);
    setCounter(0);
  };

  const incrementCounter = (data: CancelRejectProps) => () => {
    // setCounter(1)

    onRejectCancel(data);
  };

  const acceptOrder = async () => {
    // if (!verified) {
    //   // open government issued it
    //   openUnVerifiedModalHandler();

    //   return;
    // }

    if (!isAdmin) {
      // router?.push(`/page/admission`);
      return;
    }

    if (!order) {
      openAlert('Error, cannot find order');
      return;
    }

    setAccept(true);

    // send checkout link payment

    // send quote price
    const stripeCheckOut = httpsCallable(functions, stripeCheckOutV6Function);

    order.messageId = messageId;

    if (club) {
      order.club = club;
    }

    try {
      const res = await stripeCheckOut(order);

      const data = res?.data as any;
      const link = data?.link as string;

      setPayLink(link);
      setAccept(false);
    } catch (error) {
      console.log(error);
      setAccept(false);
      openAlert(`${error}`);
    }
  };

  // eslint-disable-line

  const undo = () => {
    setCounter(0);
  };

  const temp: any = extractKeyValuePairs(msgArr);
  const { Date: orderDate, Time, Venue, Activity, 'Cab fare': cabFare, Info, 'FINAL PRICE': finalPrice } = temp;

  const messageData = {
    date: orderDate,
    time: Time,
    venue: Venue,
    activity: Activity,
    cabFare: cabFare,
    info: Info,
  };

  let statuslabel = '';
  if ((hasExpired && status === option.pending) || (hasExpired && status === option.accept)) {
    statuslabel = 'Expired';
  } else {
    if (status === option.pending && !hasExpired) {
      statuslabel = isMine ? 'Waiting for response' : 'New request';
    } else if (status === option?.paid) {
      statuslabel = 'Payment success';
    } else if (status === option?.reject) {
      statuslabel =
        !isMine &&
        rejectedReason &&
        rejectedReason.split(' ').length > 0 &&
        rejectedReason.split(' ')[0].toLowerCase() === myNickname
          ? 'Rejected'
          : 'Cancelled';
    } else if (status === option?.accept && !hasExpired) {
      statuslabel = isMine ? 'Waiting for payment' : 'Waiting for payment';
    }
  }
  return (
    <Box
      sx={{
        transform: 'scaleY(-1)',
        display: 'flex',
        justifyContent: isMine ? `flex-end` : `flex-start`,
      }}
    >
      <Box>
        <Card
          sx={{
            borderRadius: 4,
            maxWidth: '400px',
            boxShadow: 'none',
            border: '1px solid #F0F0F0',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              padding={3}
              bgcolor="#F0F0F0"
              display="flex"
              justifyContent="center"
              flexDirection="column"
              gap={1}
              {...props}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
                <Box display="flex" flexDirection="row" gap={3} alignItems="center">
                  <Avatar avatars={[{ src: serviceDetails?.details?.image, alt: 'image' }]} />
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1" component="span" fontWeight={500}>
                      {serviceDetails?.details?.title}
                    </Typography>
                    <Typography variant="subtitle2" component="span" color="#999999">
                      {((serviceDetails?.details?.price ?? 0) / 100)?.toFixed(2)}/
                      {ServiceHelper.convertUnits(serviceDetails?.details?.suffix)}
                    </Typography>
                  </Box>
                </Box>
                <StatusTag
                  label={statuslabel}
                  sx={{
                    color: getColor(color[statuslabel]),
                    padding: '8px 12px',
                    width: 'fit-content',
                    paddingLeft: 3,
                    paddingRight: 3,
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
            <Box padding={3}>
              {(hasExpired && status === option.pending) || (hasExpired && status === option.accept) ? (
                <Typography variant="subtitle2" color="primary" fontWeight={500}>
                  {isMine
                    ? "Expired! Please send another request order to confirm user's availability again."
                    : 'Expired! Your client has not make any payment yet. Do not continue.'}
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={3}>
                  {status === option?.accept && !hasExpired && !isMine && (
                    <>
                      <Typography color="error" variant="body2">
                        This order is NOT confirmed! The order is only confirmed after your client make the payment.
                      </Typography>
                      <hr
                        style={{
                          color: 'gray',
                          height: 1,
                          borderWidth: 0,
                          backgroundColor: '#CCC',
                        }}
                      />
                    </>
                  )}
                  {status === option.reject && (
                    <>
                      <Box display="flex" gap={2} alignItems="center">
                        <Avatar avatars={[{ alt: 'H', src: <ProfileIcon /> }]} />
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {rejectedReason?.split('Reason:')?.[0]}
                          </Typography>
                          <Typography variant="subtitle2">
                            Reason: <span style={{ color: '#999' }}>{rejectedReason?.split('Reason:')?.[1]}</span>
                          </Typography>
                        </Box>
                      </Box>
                      <hr
                        style={{
                          color: 'gray',
                          height: 1,
                          borderWidth: 0,
                          backgroundColor: '#CCC',
                        }}
                      />
                    </>
                  )}
                  <Order orderData={messageData} meals={Venue} />
                  <Box display="flex" alignItems="center" gap="5px">
                    <Typography variant="body2" fontWeight={500}>
                      {`Final price:`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999999' }}>
                      {finalPrice}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {isPending && !hasExpired && (
              <Box padding={3}>
                {isMine ? (
                  <Box width="100%">
                    <Button
                      sx={{ marginTop: '.5rem' }}
                      onClick={incrementCounter({
                        [chatRoomIdKey]: chatRoomID,
                        [messageIdKey]: messageId,
                        [payLinkKey]: link,
                        [statusKey]: CancelOrRejectEnum.CANCEL,
                      })}
                      variant="outlined"
                      fullWidth
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                    }}
                    gap={2}
                  >
                    {counter === 0 && (
                      <Button
                        name="reject-button"
                        sx={{ textTransform: 'none', width: '100%' }}
                        variant="outlined"
                        fullWidth
                        color="error"
                        onClick={incrementCounter({
                          [chatRoomIdKey]: chatRoomID,
                          [messageIdKey]: messageId,
                          [payLinkKey]: link,
                          [statusKey]: CancelOrRejectEnum.REJECT,
                        })}
                      >
                        Reject
                      </Button>
                    )}

                    {counter > 0 && (
                      <Button
                        name="undo-button"
                        sx={{ width: '100%' }}
                        onClick={undo}
                        variant="outlined"
                        fullWidth
                        color="primary"
                      >
                        Undo
                      </Button>
                    )}

                    {counter === 0 && (
                      <Button
                        name="accept-button"
                        fullWidth
                        sx={{ textTransform: 'none', width: '100%' }}
                        variant="contained"
                        color="primary"
                        // disabled = {loadingAccept || loadingReject || (!reason && counter > 0)}
                        onClick={() => {
                          setCounter(1);
                        }}
                      >
                        Accept
                      </Button>
                    )}

                    {counter > 0 && (
                      <Button
                        name="confirm-button"
                        fullWidth
                        sx={{ textTransform: 'none', width: '100%' }}
                        variant="contained"
                        color="primary"
                        loading={loadingAccept}
                        onClick={acceptOrder}
                        // endIcon={loadingAccept && <LoadingIcon size={12} />}
                      >
                        Confirm
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {status === option.reject && (
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                }}
                gap={2}
                borderRadius={4}
              >
                {isMine ? (
                  <Button
                    sx={{ textTransform: 'none', margin: 3, width: 'max-content' }}
                    onClick={requestNewOrder}
                    variant="contained"
                    color="primary"
                  >
                    Request an new order
                  </Button>
                ) : (
                  rejectedReason &&
                  rejectedReason.split(' ').length > 0 &&
                  rejectedReason.split(' ')[0].toLowerCase() === myNickname && (
                    <Button
                      sx={{ textTransform: 'none', margin: 3 }}
                      onClick={revertToAcceptReject}
                      variant="outlined"
                      color="primary"
                    >
                      Undo
                    </Button>
                  )
                )}
              </Box>
            )}

            {status === option.accept && (
              <Box display="flex" width="100%" padding={3}>
                {!hasExpired && (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                    }}
                    gap={2}
                  >
                    <Button
                      sx={{ textTransform: 'none', width: '100%' }}
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={incrementCounter({
                        [chatRoomIdKey]: chatRoomID,
                        [messageIdKey]: messageId,
                        [payLinkKey]: link,
                        [statusKey]: CancelOrRejectEnum.CANCEL,
                      })}
                    >
                      Cancel
                    </Button>

                    {isMine && (
                      <Button
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          width: '100%',
                        }}
                        onClick={() => {
                          if (payLink) {
                            // const id = payLink.getQueryStringValue('id');

                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // const id = payLink?.[Helper?.getQueryStringValue('id')];
                            const id = payLink?.split('id=')[1];
                            dispatch(setSelectedConversation({ data: undefined }));
                            if (!isMobile) {
                              dispatch(setIsOpenChatDrawer(!isOpenChatDrawer));
                            }

                            router.push(`/checkout?id=${id}`);
                          }
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Make Payment
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
        <Typography
          variant="caption"
          sx={{ color: '#999999' }}
          display="flex"
          justifyContent="flex-end"
          paddingTop="4px"
        >
          Read {dayjs(date)?.format('hh:mm A')}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
