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
  const diffMs = today.getTime() - createdAt?.toDate().getTime();
  const diffMins = Math.round(diffMs / 60000);
  const [hasExpired, setExpired] = useState<boolean>(type === 5 ? diffMins > Helper?.minutesToExpire() : false);
  const { status, price, venue } = messageData;

  // console.log('hasExpired', hasExpired, orderStatus);

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
  const getStatusString = (value: number, isMine: boolean) => {
    const getStatus = (status: number, mineText: string, otherText: string) => (isMine ? mineText : otherText);

    switch (value) {
      case option.pending:
        if(hasExpired){
          return "Expired"
        }else{
          return getStatus(value, 'Waiting for response', 'New request');
        }
      case option.paid:
        return 'Payment success';
      case option.reject:
        return cancelOrReject === 'rejected' ? 'Rejected' : 'Cancelled';
      case option.accept:
        if(hasExpired){
          return "Expired"
        }else{
          return getStatus(value, 'Waiting for payment', 'Waiting for payment');
        }
        
      default:
        return 'Expired';
    }
  };
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
      ) : 
    
        status === 'order' ? (
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
                    label={getStatusString(orderStatus, isMine)}
                    sx={{
                      color: getColor(color[getStatusString(orderStatus, isMine)]),
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

              <Box p={3}>
                {hasExpired ? (
                  <Typography variant="subtitle2" color={'primary'} fontWeight={500}>
                    Expired! Please send another request order to confirm user's availability again
                  </Typography>
                ) : (
                  <>
                    {['Waiting for payment'].includes(getStatusString(orderStatus, isMine)) && (
                      <Typography
                        variant="subtitle2"
                        color={'error'}
                        fontSize={12}
                        lineHeight={'16px'}
                        fontWeight={400}
                      >
                        This order is NOT confirmed! The order is only confirmed after your client make the payment.
                      </Typography>
                    )}
                    {!['Payment success', 'Waiting for response', 'New request'].includes(
                      getStatusString(orderStatus, isMine)
                    ) && (
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
                            backgroundColor: '#CCC',
                            margin: '12px 0',
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Box>

              {!hasExpired && (
                <Box display="flex" gap={4} flexDirection="column" p={3}>
                  <Order orderData={messageData} meals={venue !== ''} />
                  <Box display="flex" alignItems="center" gap="5px">
                    <Typography variant="body2" fontWeight={500}>
                      {`Final price:`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999999' }}>
                      {price}
                    </Typography>
                  </Box>
                  {!['Payment success'].includes(getStatusString(orderStatus, isMine)) && (
                    <Box display="flex" gap={2} justifyContent="center">
                      {['Rejected', 'Cancelled'].includes(getStatusString(orderStatus, isMine)) && isMine && (
                        <Button variant="contained" color="primary" sx={{ width: 'fit-content' }} onClick={handleClick}>
                          Request a new order
                        </Button>
                      )}
                      {['Waiting for response'].includes(getStatusString(orderStatus, isMine)) && isMine ? (
                        <Button variant="outlined" color="error" sx={{ width: 'fit-content' }} onClick={handleClick}>
                          Cancel
                        </Button>
                      ) : (
                        <>
                          <Button variant="outlined" color="error" sx={{ width: 184 }} onClick={() => handleReject()}>
                            {'Reject'}
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: 184 }}
                            onClick={() => handleReject()}
                          >
                            {'Accept'}
                          </Button>
                        </>
                      )}
                    </Box>
                  )}
                  {optionStatus === option?.accept && (
                    <Typography variant="subtitle2" color={'error'} fontSize={12} lineHeight={'16px'} fontWeight={500}>
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
            Read {lastSeen}
          </Typography>
        </Box>
      ) : (
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
                    label={getStatusString(orderStatus, isMine)}
                    sx={{
                      color: getColor(color[getStatusString(orderStatus, isMine)]),
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

              <Box p={3}>
                {['Expired'].includes(getStatusString(orderStatus, isMine)) ? (
                  <Typography variant="subtitle2" color={'primary'} fontWeight={500}>
                    Expired! Please send another request order to confirm user's availability again
                  </Typography>
                ) : (
                  <>
                    {['Waiting for payment'].includes(getStatusString(orderStatus, isMine)) && (
                      <Typography
                        variant="subtitle2"
                        color={'error'}
                        fontSize={12}
                        lineHeight={'16px'}
                        fontWeight={400}
                      >
                        This order is NOT confirmed! The order is only confirmed after your client make the payment.
                      </Typography>
                    )}
                    {!['Payment success', 'Waiting for response', 'New request'].includes(
                      getStatusString(orderStatus, isMine)
                    ) && (
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
                            backgroundColor: '#CCC',
                            margin: '12px 0',
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Box>

              {!['Expired'].includes(getStatusString(orderStatus, isMine)) && (
                <Box display="flex" gap={4} flexDirection="column" p={3}>
                  <Order orderData={messageData} meals={venue !== ''} />
                  <Box display="flex" alignItems="center" gap="5px">
                    <Typography variant="body2" fontWeight={500}>
                      {`Final price:`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999999' }}>
                      {price}
                    </Typography>
                  </Box>
                  {!['Payment success'].includes(getStatusString(orderStatus, isMine)) && (
                    <Box display="flex" gap={2} justifyContent="center">
                      {['Rejected', 'Cancelled'].includes(getStatusString(orderStatus, isMine)) && isMine && (
                        <Button variant="contained" color="primary" sx={{ width: 'fit-content' }} onClick={handleClick}>
                          Request a new order
                        </Button>
                      )}
                      {['Waiting for response'].includes(getStatusString(orderStatus, isMine)) && isMine ? (
                        <Button variant="outlined" color="error" sx={{ width: 'fit-content' }} onClick={handleClick}>
                          Cancel
                        </Button>
                      ) : (
                        <>
                          <Button variant="outlined" color="error" sx={{ width: 184 }} onClick={() => handleReject()}>
                            {'Reject'}
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: 184 }}
                            onClick={() => handleReject()}
                          >
                            {'Accept'}
                          </Button>
                        </>
                      )}
                    </Box>
                  )}
                  {optionStatus === option?.accept && (
                    <Typography variant="subtitle2" color={'error'} fontSize={12} lineHeight={'16px'} fontWeight={500}>
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
            Read {lastSeen}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageBubble;
