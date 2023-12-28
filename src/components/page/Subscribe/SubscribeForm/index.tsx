import Box from '@/components/atoms/box';
import React from 'react';
import styles from '../subscribe.module.css';
import { Card, CardContent } from '@mui/material';
import Typography from '@/components/atoms/typography';
import CheckBox from '@/components/atoms/checkbox';
import Button from '@/components/atoms/button';
import FirePercentage from '@/components/atoms/icons/firePercentage';
import useSubscribeFormHook from './useSubscribeFormHook';
import SubscriptionCard from '@/components/molecules/card/subcriptionCard';
import Input from '@/components/atoms/input';

const SubscribeForm = () => {
  const {
    isMobile,
    offerTypes,
    activePlan,
    promoCode,
    varifyPromo,
    checkPromoloading,
    promoDescription,
    finalPrice,
    check,
    planArr,
    loading,
    onChangePlan,
    handlePromoCodeChanges,
    onClickPromoVarify,
    handleCheck,
    handleUpgrade,
  } = useSubscribeFormHook();

  return (
    <Box className={styles.subascribeBox}>
      {' '}
      <Card className={styles.subascribeCard}>
        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {promoDescription && (
            <Box className={styles.advertisement}>
              <FirePercentage />
              <Typography variant="subtitle1" component={'span'} fontWeight={500} color={'#1A1A1A'}>
                {promoDescription}
              </Typography>
            </Box>
          )}
          {/* Card Header */}
          <Box className={styles.cardHeader}>
            <Typography variant="h2" component={'span'} fontWeight={500} color={'#1A1A1A'}>
              Subscriptions
            </Typography>
          </Box>
          {/* Card Offers */}
          <Box className={styles.cardOffers}>
            {offerTypes?.map((item, index) => {
              return (
                <Box key={index} className={styles.offerCard}>
                  <Box display={'flex'} justifyContent={'center'}>
                    <Box
                      sx={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#F0F0F0',
                        borderRadius: '100px',
                      }}
                    >
                      {item?.icon}
                    </Box>
                  </Box>
                  <Typography variant="body1" component={'span'} fontWeight={500} color={'#1A1A1A'}>
                    {item?.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          {/* Plan's Card */}
          <Box className={styles.planCards}>
            {planArr?.map((item, index) => {
              return (
                <SubscriptionCard
                  key={index}
                  index={index}
                  priceID={
                    window?.location?.origin === 'http://localhost:3000'
                      ? 'price_1LVZgKFwkTcpylgWgMHfbsv7'
                      : 'price_1LjGb4FwkTcpylgWSDEqKloV'
                  }
                  size={isMobile ? 'small' : 'large'}
                  discount={item?.discount}
                  isActive={activePlan == index}
                  onClickCard={onChangePlan}
                  finalPrice={finalPrice}
                />
              );
            })}
            {/* <SubscriptionCard duration={jsonMonthly[1]} isActive={activePlan == 1} onClick={() => onChangePlan(1)} />
            <SubscriptionCard duration={jsonMonthly[2]} isActive={activePlan == 2} onClick={() => onChangePlan(2)} /> */}
          </Box>
          {/* Apply Promo Code */}
          {activePlan > 0 && (
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <Input
                  fullWidth
                  size="small"
                  placeholder="Promo code"
                  value={promoCode}
                  inputProps={{ sx: { padding: '12px 24px', height: '24px' } }}
                  onChange={handlePromoCodeChanges}
                />
                {varifyPromo?.isVarify && (
                  <Typography
                    variant="body2"
                    component="span"
                    fontSize={'12px'}
                    color={varifyPromo?.valid ? '#4CAF4F' : '#E32D2D'}
                  >
                    {varifyPromo?.valid ? `Valid code. The order now is $23.98 off.` : `Invalid promo code`}
                  </Typography>
                )}
              </Box>
              <Box>
                <Button
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={null}
                  loading={checkPromoloading}
                  sx={{
                    borderRadius: 50,
                    fontSize: '16px',
                    fontWeight: 700,
                    padding: '12px 20px',
                    textTransform: 'none',
                    width: isMobile ? 'fit-content' : '160px',
                  }}
                  variant="outlined"
                  onClick={onClickPromoVarify}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          )}
          {/* Footer Section */}
          <Box className={styles.footer}>
            <CheckBox
              label={
                <Typography variant="body2" component="span" color={'#1A1A1A'}>
                  I understand that we do not offer refunds and this subscription will be automatically renewed
                  accordingly.
                </Typography>
              }
              checked={check}
              onChange={handleCheck}
            />
            <Button
              color="primary"
              size="large"
              startIcon={null}
              disabled={!check}
              className={styles.handleUpgradeButton}
              variant="contained"
              loading={loading}
              onClick={handleUpgrade}
            >
              Upgrade
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscribeForm;
