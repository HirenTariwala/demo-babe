'use client';
import Box from '@/components/atoms/box';
import React from 'react';
import styles from './wallet.module.css';
import Typography from '@/components/atoms/typography';
import Wallet from '@/components/molecules/card/wallet';
import Button from '@/components/atoms/button';
import RechargeIcon from '@/components/atoms/icons/rechargeIcon';
import WithdrawIcon from '@/components/atoms/icons/withdrawIcon';
import useWalletHook from './useWalletHook';
import Chip from '@/components/atoms/chip';
import InfoIcon from '@/components/atoms/icons/info';
import Tabs from '@/components/atoms/tabs';
import { CalculatorHelper } from '@/utility/calculator';
import ToolTip from '@/components/atoms/tooltip';
import VerifiedModal from './components/Withdrawn/VerifiedModal';
import UnVerifiedModal from './components/Withdrawn/UnVerifiedModal';
import Toast from '@/components/molecules/toast';

const WalletPage = () => {
  const {
    isMobile,
    tabs,
    currentUser,
    uid,
    verified,
    rejectedReasonAfter,
    // balance,
    // pending,
    income,
    toastMsg,
    onOpenToastWithMsg,
    openToast,
    onCloseToast,
    // penaltyCredits,
    // nickname,
    verifiedWithdrawIsOpen,
    setVerifiedWithdrawIsOpen,
    unVerifiedWithdrawIsopen,
    setUnVerifiedWithdrawIsOpen,
    onClickRecharge,
    withdrawButtonClick,
  } = useWalletHook();

  return (
    <Box>
      <Toast alertMessage={toastMsg} onClose={onCloseToast} open={openToast} />
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <Box paddingBottom={'16px'} display={'flex'} alignItems={'center'} gap={4}>
            <Typography variant="h1" fontWeight={500} color="#1A1A1A">
              Wallet
            </Typography>
            <Chip
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Typography
                    variant="body2"
                    color={'#1A1A1A'}
                    component={'span'}
                    fontWeight={500}
                    sx={{ lineHeight: '20px', display: 'flex', alignItems: 'center' }}
                  >
                    Loyalty points: {currentUser?.points ? CalculatorHelper?.priceFormat(currentUser?.points / 100) : 0}
                  </Typography>
                  <ToolTip title="Our platform give users cashback and other privileges according to the total number of Credits they bought.">
                    <InfoIcon />
                  </ToolTip>
                </Box>
              }
              variant="outlined"
              sx={{
                background: 'linear-gradient(77deg, #FFED34 11.3%, #FFD144 86.76%)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 12px',
                lineHeight: '20px',
                border: 'none',
                borderRadius: '12px',
                gap: '4px',
                '.MuiChip-label': {
                  paddingLeft: '0px',
                  paddingRight: '0px',
                },
                '.MuiChip-icon': {
                  marginLeft: '0px',
                },
              }}
            />
          </Box>
          <Box className={styles.headerCardList}>
            <Box className={styles.headerCard}>
              <Wallet
                amount={currentUser?.balance || 0}
                position="bottom"
                label="Credit Balance"
                sx={{
                  border: '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
                tooltipTitle={`“Credit” is a virtual currency used on RentBabe, it can be used to pay for services and tips. 1.00 Credit = 1.00 SGD

                “Credit balance” is the remaining deposit on your account that could be spent. The money in “Credit balance” is a non-withdrawable currency that can only be spent on the platform.`}
              />

              <Wallet
                amount={currentUser?.incomeCredits || 0}
                position="bottom"
                label="INCOME"
                tooltipTitle="“Credit income” refers to the income you have generated through providing services and collecting tips. Income can be withdrawn."
                sx={{
                  border: '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
              />
              <Wallet
                amount={currentUser?.pendingCredits || 0}
                position="bottom"
                label="PENDING INCOME"
                tooltipTitle="Pending Credit refers to your Credit income that is within the Security Period (3-7 days). They will be transferred to your account after this period.
                
                If you’ve completed less than 3 orders, your Security Period would be 7 days.
                
                If you’ve completed 3-9 orders, your Security Period would be 5 days.
                
                If you’ve completed over 10 orders, your Security Period would be 3 days."
                sx={{
                  border: '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
              />
            </Box>
            <Box className={styles.walletBotton}>
              <Button
                color="primary"
                size="small"
                startIcon={<RechargeIcon />}
                sx={{
                  borderRadius: 50,
                  fontSize: '16px',
                  fontWeight: 700,
                  padding: '8px 20px',
                  textTransform: 'none',
                  width: 'auto',
                }}
                onClick={onClickRecharge}
                variant="outlined"
              >
                Recharge
              </Button>
              <Button
                color="primary"
                size="small"
                startIcon={<WithdrawIcon />}
                sx={{
                  borderRadius: 50,
                  fontSize: '16px',
                  fontWeight: 700,
                  padding: '8px 20px',
                  textTransform: 'none',
                  width: 'auto',
                }}
                onClick={withdrawButtonClick}
                variant="outlined"
              >
                Withdraw
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={styles.body}>
        <Box className={styles.bodyContent}>
          <Typography variant="h4" fontWeight={500} color="#1A1A1A">
            Transaction history
          </Typography>
          <Tabs
            tabBottomPadding="20px"
            tabsData={tabs}
            sx={{
              '.MuiTabs-scroller': {
                width: '100%',
                overflowX: 'auto !important',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* {isOpenWithdraw && <Withdrawn isOpen={isOpenWithdraw} isVerified={isVerified} />} */}
      {verifiedWithdrawIsOpen && (
        <VerifiedModal
          // penalty={(penaltyCredits ?? 0) / 100}
          income={(income ?? 0) / 100}
          open={verifiedWithdrawIsOpen}
          onClose={() => setVerifiedWithdrawIsOpen(false)}
          // onOpenToastWithMsg={onOpenToastWithMsg}
        />
      )}

      <UnVerifiedModal
        myUID={uid}
        verified={verified}
        // verified={undefined}
        rejectedReasonAfter={rejectedReasonAfter}
        open={unVerifiedWithdrawIsopen}
        onClose={() => setUnVerifiedWithdrawIsOpen(false)}
        onOpenToastWithMsg={onOpenToastWithMsg}
      />
    </Box>
  );
};

export default WalletPage;
