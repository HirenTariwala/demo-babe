import React, { useEffect, useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import Price from '@/components/molecules/price';
import NextImage from '@/components/atoms/image';
import Order from '@/components/molecules/content/order';
import Chip from '@/components/atoms/chip';
import { getColor } from '@/common/utils/getcolor';
import { doc, getDoc } from 'firebase/firestore';
import { CONVERSATION, MESSAGES } from '@/keys/firestoreKeys';
import { db } from '@/credentials/firebase';
import { useTranslations } from 'next-intl';
import { extractKeyValuePairs } from '@/common/utils/data';

interface IRequestOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  orderDeatils: any;
  setOpen: (arg: boolean) => void | undefined;
}

const color: any = {
  Completed: 'success',
  Cancelled: 'error',
  Expired: 'primary',
  Pending: 'warning',
  Refunded: 'error',
  PendingRefund: 'warning',
};

const ViewOrderModal = ({ isMobile, isTablet, isOpen, orderDeatils, setOpen }: IRequestOrderModal) => {
  const [data, setData] = useState<any>('');
  const t = useTranslations('orderPage');
  const { service, details } = orderDeatils;
  const msgArr = data?.split('\n');
  const temp: any = extractKeyValuePairs(msgArr);
  const { Date, Time, Venue, Activity, 'Cab fare': cabFare, Info, finalPrice } = temp;
  const singleServvicePrice = service?.price ? service?.price / 100 : 0;
  const totalPrice = details?.price ? details?.price / 100 : 0;
  let cabFee = 0;
  const cabs: string = msgArr?.[5]?.split('+')?.[1] || '';
  if (msgArr?.[5]?.split(': ')?.[1]) {
    cabFee = parseInt(cabs?.split(' ')[0] || '0');
  }
  const netServiceprice = totalPrice - cabFee;

  let newTimeFormat = 'Game';

  if ([1, 2]?.includes(service?.suffix)) {
    const hour = netServiceprice / singleServvicePrice;

    newTimeFormat = `${hour}${service?.suffix === 1 ? 'Hr' : 'Game'}`;
  } else if (service?.suffix === 0) {
    newTimeFormat = `${(netServiceprice / singleServvicePrice) * 15}Min`;
  }

  useEffect(() => {
    getDoc(doc(db, CONVERSATION, `${details?.chatRoomId}`, MESSAGES, `${details?.messageID}`)).then((snap) => {
      const temp = snap.data();
      setData(temp?.ctn);
    });
  }, []);

  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={() => setOpen(false)}
        footer={
          <Box display="flex" justifyContent={'flex-end'} gap={3} p={4}>
            <Button
              variant="outlined"
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => setOpen(false)}
            >
              {t('btnClose')}
            </Button>
            {['Pending refund'].includes(details?.status) && (
              <Button
                variant="contained"
                sx={{
                  p: '12px 20px',
                  whiteSpace: 'nowrap',
                  height: 48,
                }}
                onClick={() => {}}
              >
                {t('btnUpdateRequest')}
              </Button>
            )}
          </Box>
        }
        sx={{
          '.MuiPaper-root': {
            borderRadius: '24px',
            width: isMobile ? '100%' : isTablet ? '800px' : '1000px',
          },
          '.MuiDialogContent-root': {
            position: 'relative',
          },
          '.MuiDialogActions-root': {
            p: 'unset',
          },
        }}
        open={isOpen}
      >
        <Box display="flex" flexDirection="column" gap={5}>
          <Typography variant="h3" fontWeight={500}>
            {t('orderDetailsHeader')}
          </Typography>
          <Box display="flex" gap={3} justifyContent={'flex-start'}>
            <NextImage src={service?.image} alt={'image'} width={80} height={80} style={{ borderRadius: 12 }} />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                gap: 3,
                justifyContent: isMobile ? 'flex-start' : 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                flex="1 0 0"
                gap={3}
                width="-webkit-fill-available"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="h5" component="span">
                    {service?.title}
                  </Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar avatars={[{ alt: 'H', src: details?.profile }]} sx={{ width: 24, height: 24 }} />
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="subtitle2" fontWeight={500} color="#646464">
                        {details?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={details?.status}
                    sx={{
                      color: getColor(color[details?.status]),
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
              <Price
                priceData={{
                  price: details?.price || 0,
                  min: details?.price || 0,
                  max: details?.price || 0,
                  hr: newTimeFormat,
                }}
                category="1"
              />
            </Box>
          </Box>
          {['Refunded'].includes(details?.status) && (
            <Typography variant="body1" fontWeight={500}>
              {t('orderDetailsRefundText')}
            </Typography>
          )}
          <Box bgcolor="#F9F9F9" padding={3} borderRadius={3}>
            <Order
              orderData={{
                date: Date,
                time: Time,
                venue: Venue,
                activity: Activity,
                cabFare: cabFare,
                info: Info,
              }}
              meals={Venue}
            />
          </Box>
          {['Refunded', 'Pending refund'].includes(details?.status) && (
            <>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" fontWeight={500} component="span">
                  {t('refundReasonKey')}
                </Typography>
                <Typography variant="body1" component="span" color="#646464">
                  {t('scamKey')}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" fontWeight={500} component="span">
                  {t('photoEvidenceKey')}
                </Typography>
                <NextImage src={''} alt={'image'} width={80} height={80} style={{ borderRadius: 12 }} />
              </Box>
            </>
          )}
        </Box>
      </Dialog>
      {/* <Toast alertMessage="Order sent!" onClose={() => setToast(false)} open={openToast} /> */}
    </>
  );
};

export default ViewOrderModal;
