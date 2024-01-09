import { getColor } from '@/common/utils/getcolor';
import Box, { IBox } from '@/components/atoms/box';
import StatusTag from '@/components/atoms/chip/statustags';
import Typography from '@/components/atoms/typography';
import { Card, CardContent } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Order from '../../content/order';
import Button from '@/components/atoms/button';
import Avatar from '@/components/atoms/avatar';
import ProfileIcon from '@/components/atoms/icons/profile';
import { ServiceHelper } from '@/utility/serviceHelper';
import ChatBubble from '../chatBubble';
import { VariableWindowListContext } from '@/components/organisms/list/VariableWindowList';
import { ServiceDetails } from '@/props/servicesProps';
import { Helper } from '@/utility/helper';
import CountDown from '@/components/page/Login/Form/Timer/CountDown';
import { option } from '@/enum/myEnum';
import { Timestamp } from 'firebase/firestore';
import BabeMessageCard from '../messagecard';

const color: any = {
  ['Payment Success']: 'success',
  cancel: 'error',
  Expired: 'error',
  newrequest: 'warning',
  Rejected: 'error',
  ['Waiting for payment']: 'warning',
};

interface IMessageBubble extends IBox {
  index: number;
  messageData: any;
  services: ServiceDetails;
  msg: string;
  isMine: boolean;
  lastSeen: string;
  status: option;
  createdAt: Timestamp;
  orderStatus: number;
  reason?: string;
  type: number;
}

const getStatusString = (value:number, isMine:boolean) => {
  const getStatus = (status: number, mineText:string, otherText:string) => (isMine ? mineText : otherText);

  switch (value) {
    case option.pending:
      return getStatus(value, 'Waiting for response', 'New request');
    case option.paid:
      return 'Payment Success';
    case option.reject:
      return 'Rejected';
    case option.accept:
      return getStatus(value, 'Waiting for payment', 'Waiting for payment');
    default:
      return '';
  }
};

const MessageBubble = ({
  index,
  msg,
  services,
  orderStatus,
  reason,
  status: optionStatus,
  lastSeen,
  createdAt,
  type,
  isMine,
  messageData,
  ...props
}: IMessageBubble) => {
  const [accept, setAccept] = useState<boolean>();
  const { size, setSize } = useContext(VariableWindowListContext);
  const today = new Date();
  const diffMs = today.getTime() - createdAt.toDate().getTime();
  const diffMins = Math.round(diffMs / 60000);
  const [hasExpired, setExpired] = useState<boolean>(diffMins > Helper?.minutesToExpire());
  const {  status,price, venue } = messageData;

  console.log("hasExpired", hasExpired)

  const isPending = optionStatus === option.pending;
  useEffect(() => {
    const root = document.getElementById(index?.toString());
    const height = root?.getBoundingClientRect()?.height ?? 0;

    setSize?.(index, height);
  }, [size?.width]);

  const handleClick = () => {
    setAccept(true);
  };
  const handleReject = () => {
    setAccept(false);
  };
  const t: any = reason
    ?.split('Reason:')?.[0]
    .split(' ')
    .findIndex((i) => i === 'rejected' || i === 'cancel');
  const cancelOrReject = reason?.split('Reason:')?.[0].split(' ')[t];
  console.log("orderrrr", getStatusString(orderStatus,isMine))
  return (
    <Box
      // ref={root}
      id={index?.toString()}
      sx={{
        transform: 'scaleY(-1)',
        display: 'flex',
        justifyContent: type == 4 ? 'center' : isMine ? `flex-end` : `flex-start`,
      }}
    >
      {status === 'text' ? (
        <ChatBubble msg={msg} isMine={isMine} lastSeen={lastSeen} />
      ) : status === "Paid" ? <BabeMessageCard headerData={{title: 'Payment recevied',amount: 100.00, orderId: 34325345}} ><></></BabeMessageCard> :  (
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
                p={3}
                bgcolor="#F0F0F0"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                gap={1}
                {...props}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
                  <Box display="flex" flexDirection="row" gap={3} alignItems="center">
                    <Avatar avatars={[{ src: services?.details?.image, alt: 'image' }]} />
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body1" component="span" fontWeight={500}>
                        {services?.details?.title}
                      </Typography>
                      <Typography variant="subtitle2" component="span" color="#999999">
                        {((services?.details?.price ?? 0) / 100)?.toFixed(2)}/
                        {ServiceHelper.convertUnits(services?.details?.suffix)}
                      </Typography>
                    </Box>
                  </Box>
                  <StatusTag
                    label={getStatusString(orderStatus,isMine)}
                    sx={{
                      color: getColor(
                        color[getStatusString(orderStatus,isMine)]
                      ),
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

              {hasExpired  && (
                <Box p={3}>
                  <Typography variant="subtitle2" color={'primary'} fontWeight={500}>
                    Expired! Please send another request order to confirm user's availability again
                  </Typography>
                </Box>
              )}
              <Box p={3}>
                <Box>
                  {!isMine && orderStatus === option.pending && (
                    <Typography variant="subtitle2" color={'error'} fontSize={12} lineHeight={'16px'} fontWeight={400}>
                      This order is NOT confirmed! The order is only confirmed after your client make the payment.
                    </Typography>
                  )}

                  {orderStatus === option.reject && (
                    <>
                      <Box display="flex" gap={2} alignItems="center">
                        <Avatar avatars={[{ alt: 'H', src: <ProfileIcon /> }]} />
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {reason?.split('Reason:')?.[0]}
                          </Typography>
                          <Typography variant="subtitle2">
                            Reason: <span style={{ color: '#999' }}>{reason?.split('Reason:')?.[1]}</span>
                          </Typography>
                        </Box>
                      </Box>
                      <hr
                        style={{
                          color: 'gray',
                          height: 1,
                          borderWidth: 0,
                          backgroundColor: '#CCCCCC',
                          margin: '12px 0',
                        }}
                      />
                    </>
                  )}
                </Box>

                <Box display="flex" gap={4} flexDirection="column">
                  {!hasExpired && (
                    <>
                      <Order orderData={messageData} meals={venue !== ''} />
                      <Box display="flex" alignItems="center" gap="5px">
                        <Typography variant="body2" fontWeight={500}>
                          {`Final price:`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999999' }}>
                          {price}
                        </Typography>
                      </Box>
                    </>
                  )}
                  {(orderStatus === option.pending ||
                    orderStatus === option.accept) && (
                      <Box display="flex" gap={2} justifyContent="center">
                        <Button
                          variant="outlined"
                          color={accept ? 'primary' : 'error'}
                          sx={{ width: 184 }}
                          onClick={() => handleReject()}
                        >
                          {accept ? 'Undo' : 'Reject'}
                        </Button>
                        <Button variant="contained" color="primary" sx={{ width: 184 }} onClick={handleClick}>
                          {accept ? 'Confirm' : 'Accept'}
                        </Button>
                      </Box>
                    )}
                    {optionStatus === option?.accept && (
                      <Typography
                        variant="subtitle2"
                        color={'error'}
                        fontSize={12}
                        lineHeight={'16px'}
                        fontWeight={500}
                      >
                        {!hasExpired && 'Expires in '}
                        {/* 10h:25m:02s */}
                        <CountDown
                          hasExpired={() => {
                            setExpired(true);
                          }}
                          minutesToExpire={Helper?.minutesToExpire()}
                          date={createdAt?.toDate()}
                        />
                      </Typography>
                    )}
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Typography
            variant="caption"
            sx={{ color: '#999999' }}
            display="flex"
            justifyContent="flex-end"
            paddingTop="4px"
          >
            Read {lastSeen}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageBubble;
