import Box from '@/components/atoms/box';
import React from 'react';
import styles from '../../credit.module.css';
import { Card, CardContent, Radio } from '@mui/material';
import Typography from '@/components/atoms/typography';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import PercentageIcon from '@/components/atoms/icons/percentageIcon';
import Button from '@/components/atoms/button';
import useCreditCardHook from './useCreditCardHook';
import RechargeAmount from '@/components/molecules/card/rechargeamount';
import { PayByEnum } from '@/enum/myEnum';
import NextImage from '@/components/atoms/image';
import PayNow from '@/assets/payNow.png';
import GrabPay from '@/assets/grabPay.png';
import CheckBox from '@/components/atoms/checkbox';
import WalletIcon from '@/components/atoms/icons/walletIcon';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface promoMap {
  [key: string]: {
    [amt: string]: number;
  };
}
interface ICreditCard {
  functionName: string;
  promoMapState: promoMap | undefined;
}

const CreditCard = ({ functionName, promoMapState }: ICreditCard) => {
  const {
    isMobile,
    isPremium,
    pay,
    // rechargeData,
    loading,
    activeRechargePlan,
    check,
    currentUser,
    onPayChange,
    onClickRechargeCard,
    onChangeCheck,
    buyCredits,
    goToPremium,
  } = useCreditCardHook({ functionName, promoMapState });
  return (
    <Box className={styles.creditBox}>
      {' '}
      <Card className={styles.creditCard}>
        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Card Header */}
          <Box className={styles.cardHeader}>
            <Typography variant="h2" fontWeight={500} component="span" color={'#1A1A1A'}>
              Wallet recharge
            </Typography>
            <Box className={styles.cardSubHeader}>
              <Typography variant="subtitle2" fontWeight={500} component="span" color={'#646464'}>
                Your wallet balance:
              </Typography>
              <PriceLogo size={20} />
              <Typography variant="subtitle1" fontWeight={500} component="span" color={'#646464'}>
                {currentUser?.balance ? (currentUser?.balance / 100)?.toFixed(2) : '0.00'}
              </Typography>
            </Box>
          </Box>
          {/* Go Premium Card */}
          <Box className={styles.GoPremiumCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box
                sx={{
                  width: '36px',
                  height: '36px',
                  padding: '8px',
                  background: '#fff',
                  borderRadius: '100px',
                }}
              >
                <PercentageIcon />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{
                  flex: '1 0 0',
                }}
                component="span"
                color={'#1A1A1A'}
              >
                Get 10% more Credits and no transaction fees
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <Button
                variant="text"
                sx={{
                  ':hover': {
                    background: 'transparent',
                  },
                  width: 'fit-content',
                  // width: '100%',
                  // maxWidth: '160px',
                  justifyContent: 'flex-end',
                }}
                onClick={goToPremium}
              >
                Go Premium
              </Button>
            </Box>
          </Box>
          {/* Recharge Card */}
          <Box className={styles.rechargeCard}>
            {promoMapState &&
              Object.entries(promoMapState)?.map((item, index) => {
                return (
                  <RechargeAmount
                    key={index}
                    color="#1A1A1A"
                    fontSize={14}
                    fontWeight={500}
                    discount={item[1]['discount'] as number}
                    amount={item[1]['amt'] as number}
                    size={isMobile ? 'small' : 'large'}
                    isActive={activeRechargePlan === index}
                    onClick={() => onClickRechargeCard(index)}
                  />
                );
              })}
          </Box>
          {/* Payment Type Selection */}
          <Box className={styles.paymentSection}>
            <Box
              className={styles.selectPay}
              onClick={() => onPayChange(PayByEnum.paynow)}
              bgcolor={pay === PayByEnum.paynow ? '#F0F0F0' : ''}
            >
              <Radio
                sx={{ padding: '0px' }}
                color="primary"
                size="small"
                checked={pay === PayByEnum.paynow}
                value={PayByEnum.paynow}
                checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
              />
              <Box width={'36px'} height={'36px'}>
                <NextImage src={PayNow} alt="paynow" />
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Typography variant="subtitle2" fontWeight={500} component="span" color={'#1A1A1A'}>
                  Paynow
                </Typography>
                <Typography fontSize={'12px'} fontWeight={500} component="span" color={'#999'}>
                  {isPremium ? '0' : '0'}% fee
                </Typography>
              </Box>
            </Box>
            <Box
              className={styles.selectPay}
              onClick={() => onPayChange(PayByEnum.grabpay)}
              bgcolor={pay === PayByEnum.grabpay ? '#F0F0F0' : ''}
            >
              <Radio
                sx={{ padding: '0px' }}
                color="primary"
                size="small"
                checked={pay === PayByEnum.grabpay}
                value={PayByEnum.grabpay}
                checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
              />
              <Box width={'36px'} height={'36px'}>
                <NextImage src={GrabPay} alt="grabPay" />
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Typography variant="subtitle2" fontWeight={500} component="span" color={'#1A1A1A'}>
                  GrabPay
                </Typography>
                <Typography fontSize={'12px'} fontWeight={500} component="span" color={'#999'}>
                  {isPremium ? '0' : '4'}% fee
                </Typography>
              </Box>
            </Box>
            <Box
              className={styles.selectPay}
              onClick={() => onPayChange(PayByEnum.card)}
              bgcolor={pay === PayByEnum.card ? '#F0F0F0' : ''}
            >
              <Radio
                sx={{ padding: '0px' }}
                color="primary"
                size="small"
                checked={pay === PayByEnum.card}
                value={PayByEnum.card}
                checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
              />
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
                <Typography variant="subtitle2" fontWeight={500} component="span" color={'#1A1A1A'}>
                  Credit Card
                </Typography>
                <Typography fontSize={'12px'} fontWeight={500} component="span" color={'#999'}>
                  {isPremium ? '0' : '0'}% fee
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Footer Section */}
          <Box className={styles.footer}>
            <CheckBox
              onChange={onChangeCheck}
              label={
                <Typography variant="body2" component="span" color={'#646464'}>
                  I understand that Credit is a non-withdrawable currency.
                </Typography>
              }
            />
            <Button
              color="primary"
              onClick={buyCredits}
              size="large"
              startIcon={null}
              disabled={!check}
              loading={loading}
              className={styles.rechargeButton}
              // sx={{
              //   borderRadius: 50,
              //   fontSize: '16px',
              //   fontWeight: 700,
              //   padding: '12px 20px',
              //   textTransform: 'none',
              // }}
              variant="contained"
            >
              Recharge
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreditCard;
