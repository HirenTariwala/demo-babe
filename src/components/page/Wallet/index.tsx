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
import { useTranslations } from 'next-intl';

const WalletPage = () => {
  const {
    isMobile,
    tabs,
    currentUser,
    uid,
    verified,
    rejectedReasonAfter,
    income,
    toastMsg,
    setActiveTransactionTab,
    onOpenToastWithMsg,
    openToast,
    onCloseToast,
    verifiedWithdrawIsOpen,
    setVerifiedWithdrawIsOpen,
    unVerifiedWithdrawIsopen,
    setUnVerifiedWithdrawIsOpen,
    onClickRecharge,
    withdrawButtonClick,
  } = useWalletHook();
  const t = useTranslations('walletPage');

  return (
    <Box>
      {/* <Toast alertMessage={toastMsg} onClose={onCloseToast} open={openToast} /> */}
      {/* {isOpenAlert && !getAllTransaction && hasNextPage && (
        <Box sx={{ background: '#f9f9f9', paddingTop: '20px' }}>
          <Alert
            sx={{
              width: '100%',
              maxWidth: '960px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            onClose={() => {
              setIsOpenAlert(false);
            }}
            action={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Button
                  color="inherit"
                  size="small"
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => {
                    setGetAllTransaction(true);
                  }}
                >
                  GET ALL
                </Button>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setIsOpenAlert(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            }
            severity="warning"
          >
            <Typography variant="body1" color="inherit">
              Get all transaction Click GET ALL.
            </Typography>
          </Alert>
        </Box>
      )} */}
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <Box paddingBottom={'16px'} display={'flex'} alignItems={'center'} gap={4}>
            <Typography variant={isMobile ? 'h2' : 'h1'} fontWeight={500} color="#1A1A1A">
              {t('heading')}
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
                    {t('pointKey')}:{' '}
                    {currentUser?.points ? CalculatorHelper?.priceFormat(currentUser?.points / 100) : 0}
                  </Typography>
                  <ToolTip title={t('loyaltyTooltipText')}>
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
                label={t('walletCardCreditBalance')}
                sx={{
                  border: '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
                tooltipTitle={t('creditBalanceTooltipText')}
              />

              <Wallet
                amount={currentUser?.incomeCredits || 0}
                position="bottom"
                label={t('walletCardCreditIncome')}
                tooltipTitle={t('creditIncomeTooltipText')}
                sx={{
                  border: '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
              />
              <Wallet
                amount={currentUser?.pendingCredits || 0}
                position="bottom"
                label={t('walletCardPendingBalance')}
                tooltipTitle={t('pendingIncomeTooltipText')}
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
                {t('rechargeButton')}
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
                {t('withdrawButton')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={styles.body}>
        <Box className={styles.bodyContent}>
          <Typography variant="h4" fontWeight={500} color="#1A1A1A">
            {t('transactionHeading')}
          </Typography>

          <Tabs
            tabBottomPadding="20px"
            onTabChange={(e) => {
              setActiveTransactionTab(e ?? 0);
            }}
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
