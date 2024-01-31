'use client';
import Box from '@/components/atoms/box';
import React from 'react';
import styles from './checkout.module.css';
import { Card, CardContent } from '@mui/material';
import Typography from '@/components/atoms/typography';
import Button from '@/components/atoms/button';
import NextImage from '@/components/atoms/image';
import useCheckoutHook from './useCheckoutHook';
import LoadingIcon from '@/components/atoms/icons/loading';
import { servicesKey } from '@/keys/firestoreKeys';
import { Helper } from '@/utility/helper';
import dayjs from 'dayjs';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import WalletIcon from '@/components/atoms/icons/walletIcon';
import CountDown from '../Login/Form/Timer/CountDown';
import { Timestamp } from 'firebase/firestore';
import { OrderStatusEnum } from '@/enum/orderEnum';
import PaymentConfimationDialog from './components/PaymentConfimationDialog';

const Hr = () => {
  return (
    <hr
      style={{
        background: '#CCC',
        height: '1px',
        margin: '16px 0px',
      }}
    />
  );
};
const Checkout = () => {
  const {
    isMobile,
    router,
    loading,
    hasExpired,
    data,
    content,
    newTimeFormat,
    totalServicePrice,
    cabFare,
    totalAmount,
    totalBalance,
    isOpenPayConfirmation,
    chatLoading,
    setExpired,
    setIsOpenPayConfirmation,
    onClosePayConfirmationHandle,
    chatOnClick,
  } = useCheckoutHook();

  return (
    <Box className={styles.checkoutBox}>
      {' '}
      <Card className={styles.checkoutCard}>
        {loading ? (
          <Box className={styles.checkoutCardLoading}>
            <LoadingIcon />
          </Box>
        ) : hasExpired ? (
          <Box className={styles.checkoutCardLoading}>This Order Is Expired</Box>
        ) : (
          <CardContent sx={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Card Header */}
            <Box className={styles.cardHeader}>
              <Typography variant="h2" component={'span'} fontWeight={500} color={'#1A1A1A'}>
                Confirm payment
              </Typography>
              {data?.st === OrderStatusEnum.pending && data?.t && (
                <Typography variant="body2" component={'span'} fontWeight={500} color={'#999'}>
                  Please make payment in{' '}
                  <CountDown
                    hasExpired={() => setExpired(true)}
                    minutesToExpire={Helper?.minutesToExpire()}
                    date={(data?.t as Timestamp)?.toDate()}
                  />
                  , otherwise the order will be cancelled automatically
                </Typography>
              )}
            </Box>
            {/* Card Main Body */}
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {!isMobile && (
                <Box
                  sx={{
                    background: '#F9F9F9',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '12px',
                  }}
                >
                  <NextImage src={data?.[servicesKey]?.details?.image} alt="Service" width={36} height={36} />
                </Box>
              )}
              <Box
                sx={{
                  flex: '1 0 0',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {isMobile && (
                    <Box
                      sx={{
                        background: '#F9F9F9',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '100px',
                      }}
                    >
                      <NextImage src={data?.[servicesKey]?.details?.image} alt="Service" width={24} height={24} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      flex: '1 0 0',
                    }}
                  >
                    <Typography variant="subtitle1" component={'span'} fontWeight={500}>
                      {data?.[servicesKey]?.details?.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <NextImage src={data?.inf?.[data?.cuid]?.u} alt="" width={20} height={20} />
                      <Typography variant="body2" component={'span'} fontWeight={500} color="#646464">
                        {data?.inf?.[data?.cuid]?.nick}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Button
                      sx={{
                        maxWidth: 'fit-content',
                        width: '100%',
                      }}
                      variant="outlined"
                      color="primary"
                      onClick={chatOnClick}
                      loading={chatLoading}
                    >
                      Chat
                    </Button>
                  </Box>
                </Box>
                <Hr />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '5px',
                    }}
                  >
                    <Typography variant="body2" component={'span'} fontWeight={500}>
                      Date:
                    </Typography>
                    <Typography variant="body2" component={'span'} color="#999">
                      {content ? content[1]?.split(': ')[1] ?? '' : ''}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '5px',
                    }}
                  >
                    <Typography variant="body2" component={'span'} fontWeight={500}>
                      Time:
                    </Typography>
                    <Typography variant="body2" component={'span'} color="#999">
                      {content ? content[2]?.split(': ')[1] ?? '' : ''}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '5px',
                    }}
                  >
                    <Typography variant="body2" component={'span'} fontWeight={500}>
                      Venue:
                    </Typography>
                    <Typography variant="body2" component={'span'} color="#999">
                      {content ? content[3]?.split(': ')[1] ?? '' : ''}
                    </Typography>
                  </Box>
                </Box>
                <Hr />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" component={'span'} fontWeight={500} color="#646464">
                      {`${data?.[servicesKey]?.details?.title} (${newTimeFormat?.toLowerCase()})`}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component={'span'}
                      fontWeight={500}
                      color="#646464"
                      display="flex"
                      alignItems="center"
                      gap="4px"
                    >
                      <PriceLogo />
                      {totalServicePrice}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" component={'span'} fontWeight={500} color="#646464">
                      Cab fare
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component={'span'}
                      fontWeight={500}
                      color="#646464"
                      display="flex"
                      alignItems="center"
                      gap="4px"
                    >
                      <PriceLogo />
                      {cabFare}
                    </Typography>
                  </Box>
                </Box>
                <Hr />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '16px',
                  }}
                >
                  <Typography variant="body2" component={'span'} fontWeight={500} color="#1A1A1A">
                    Final price
                  </Typography>
                  <Typography
                    variant="h3"
                    component={'span'}
                    fontWeight={700}
                    color="#1A1A1A"
                    display="flex"
                    alignItems="center"
                    gap="4px"
                  >
                    <PriceLogo size={34} />
                    {totalAmount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <Box
                    sx={{
                      background: '#F0F0F0',
                      display: 'flex',
                      width: 'fit-content',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '12px',
                      gap: '12px',
                    }}
                  >
                    <Box
                      sx={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#F9F9F9',
                        borderRadius: '100px',
                      }}
                    >
                      <WalletIcon size={20} />
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography variant="caption" fontWeight={500} component="span" color={'#999'}>
                        Credit balance
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component={'span'}
                        fontWeight={500}
                        color="#1A1A1A"
                        display="flex"
                        alignItems="center"
                        gap="4px"
                      >
                        <PriceLogo />
                        {totalBalance}
                      </Typography>
                    </Box>
                    {totalBalance < parseFloat(totalAmount) && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          router.push('/credit');
                        }}
                        color="primary"
                      >
                        Recharge
                      </Button>
                    )}
                  </Box>
                  {totalBalance < parseFloat(totalAmount) && (
                    <Typography variant="caption" component={'span'} fontWeight={500} color="error">
                      Your credit balance is not enough to make this transaction
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Footer Section */}
            <Box className={styles.footer}>
              <Button
                color="primary"
                disabled={totalBalance < parseFloat(totalAmount)}
                size="large"
                startIcon={null}
                onClick={() => {
                  setIsOpenPayConfirmation(true);
                }}
                variant="contained"
              >
                Check out
              </Button>
            </Box>
          </CardContent>
        )}
      </Card>
      {isOpenPayConfirmation && (
        <PaymentConfimationDialog
          data={data}
          open={isOpenPayConfirmation}
          onCancelHandle={onClosePayConfirmationHandle}
        />
      )}
    </Box>
  );
};

export default Checkout;
