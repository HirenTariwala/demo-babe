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
import Withdrawn from './components/Withdrawn';

const WalletPage = () => {
  const { isMobile, activeCard, tabs, WithdrawnFooter, onCardClick } = useWalletHook();
  return (
    <Box>
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <Box paddingBottom={'16px'} display={'flex'} alignItems={'center'} gap={4}>
            <Typography variant="h1" fontWeight={500} color="#1A1A1A">
              Wallet
            </Typography>
            <Chip
              icon={<InfoIcon />}
              label="Loyalty points: 12"
              variant="outlined"
              sx={{
                background: 'linear-gradient(77deg, #FFED34 11.3%, #FFD144 86.76%)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 12px',
                lineHeight: '20px',
                border: 'none',
                borderRadius: '12px',
                flexDirection: 'row-reverse',
                alignItems: 'flex-start',
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
                index={0}
                amount={4000}
                position="bottom"
                label="Credit Balance"
                tooltipTitle="Credit Balance"
                sx={{
                  border: activeCard === 0 ? '2px solid #FFD443' : '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
                onClick={onCardClick}
              />
              <Wallet
                index={1}
                amount={4000}
                position="bottom"
                label="INCOME"
                tooltipTitle="INCOME"
                sx={{
                  border: activeCard === 1 ? '2px solid #FFD443' : '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
                onClick={onCardClick}
              />
              <Wallet
                index={2}
                amount={4000}
                position="bottom"
                label="PENDING INCOME"
                tooltipTitle="PENDING INCOME"
                sx={{
                  border: activeCard === 2 ? '2px solid #FFD443' : '2px solid rgba(0, 0, 0, 0)',
                  padding: isMobile ? 4 : 6,
                }}
                onClick={onCardClick}
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
          <Tabs resetTab={activeCard} tabBottomPadding="20px" tabsData={tabs} />
        </Box>
      </Box>
      <Withdrawn WithdrawnFooter={WithdrawnFooter} />
    </Box>
  );
};

export default WalletPage;
