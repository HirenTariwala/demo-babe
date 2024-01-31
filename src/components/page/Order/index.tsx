'use client';
import React from 'react';
import styles from './order.module.css';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import Tabs from '@/components/atoms/tabs';
import useOrderHook from './useOrderHook';
import { useTranslations } from 'next-intl';

const Order = () => {
  const { isMobile, tabs } = useOrderHook();
  const t = useTranslations('orderPage');

  return (
    <Box>
      {/* {isOpenAlert && !getAllOrder && hasNextPage && (
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
                    setGetAllOrder(true);
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
            <Typography variant="caption" color="inherit">
              Get all order Click GET ALL.
            </Typography>
          </Alert>
        </Box>
      )} */}
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={isMobile ? 'center' : 'flex-start'}
            width={'100%'}
            gap={4}
          >
            <Typography variant={isMobile ? 'h2' : 'h1'} fontWeight={500} color="#1A1A1A">
              {t('heading')}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={styles.body}>
        <Box className={styles.bodyContent}>
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
    </Box>
  );
};

export default Order;
