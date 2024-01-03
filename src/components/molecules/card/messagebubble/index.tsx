import { getColor } from '@/common/utils/getcolor';
import Box, { IBox } from '@/components/atoms/box';
import StatusTag from '@/components/atoms/chip/statustags';
import EmeetIcon from '@/components/atoms/icons/emeetIcon';
import Typography from '@/components/atoms/typography';
import { Card, CardContent } from '@mui/material';
import React, { useState } from 'react';
import Order from '../../content/order';
import Button from '@/components/atoms/button';
import Avatar from '@/components/atoms/avatar';
import ProfileIcon from '@/components/atoms/icons/profile';

const color: any = {
  completed: 'success',
  cancelled: 'error',
  expired: 'error',
  newrequest: 'warning',
  rejected: 'error',
  waitpayment: 'warning',
};

interface IMessageBubble extends IBox {
  messageData: any;
  services: string;
  rate: string;
}

const MessageBubble = ({ rate, services, messageData, ...props }: IMessageBubble) => {
  const [accept, setAccept] = useState<boolean>();
  const { status, date, time, price } = messageData;
  const handleClick = () => {
    setAccept(true);
  };
  const handleReject = () => {
    setAccept(false);
  };
  return (
    <Box>
      <Card
        sx={{
          borderRadius: 4,
          maxWidth: 400,
          boxShadow: 'none',
          border: '1px solid #F0F0F0',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box p={3} bgcolor="#F0F0F0" display="flex" justifyContent="center" flexDirection="column" gap={1} {...props}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
              <Box display="flex" flexDirection="row" gap={3} alignItems="center">
                <Box
                  sx={{
                    background: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 12,
                  }}
                >
                  <EmeetIcon />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1" component="span" fontWeight={500}>
                    {services}
                  </Typography>
                  <Typography variant="subtitle2" component="span" color="#999999">
                    {rate}
                  </Typography>
                </Box>
              </Box>
              <StatusTag
                label={status}
                sx={{
                  color: getColor(color[status]),
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
          {status === 'expired' ? (
            <Box p={3}>
              <Typography variant="subtitle2" color={'primary'} fontWeight={500}>
                Expired! Your client has not make any payment yet. Do not continue
              </Typography>
            </Box>
          ) : (
            <Box p={3}>
              {['cancelled', 'waitpayment', 'rejected'].includes(status) && (
                <Box>
                  {status === 'waitpayment' && (
                    <Typography variant="subtitle2" color={'error'} fontSize={12} lineHeight={'16px'} fontWeight={400}>
                      This order is NOT confirmed! The order is only confirmed after your client make the payment.
                    </Typography>
                  )}
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar avatars={[{ alt: 'H', src: <ProfileIcon /> }]} />
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body2" fontWeight={500}>
                        mscott has cancelled the order.
                      </Typography>
                      <Typography variant="subtitle2" color={'#999999'}>{`Reason: ${'I dont like it'}.`}</Typography>
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
                </Box>
              )}
              <Box display="flex" gap={4} flexDirection="column">
                <Order orderData={{ date: date, time: time }} />
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" fontWeight={500}>
                    Final price:{' '}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999999' }}>
                    {price}
                  </Typography>
                </Box>
                {!['expired', 'cancelled', 'completed', 'rejected'].includes(status) && (
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
                {status === 'waitingpayment' && (
                  <Typography variant="subtitle2" color={'error'} fontSize={12} lineHeight={'16px'} fontWeight={500}>
                    Expires in 10h:25m:02s
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      <Typography variant="caption" sx={{ color: '#999999' }}>
        Sent 12:12 PM
      </Typography>
    </Box>
  );
};

export default MessageBubble;
