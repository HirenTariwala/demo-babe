'use client';
import React from 'react';
import styles from './order.module.css';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import Tabs from '@/components/atoms/tabs';
import useOrderHook from './useOrderHook';
import EmptyData from '@/components/molecules/EmptyData';
import EmptyBoxIcon from '@/components/atoms/icons/emptyBoxIcon';

const Order = () => {
  const { isMobile, isEmpty, tabs } = useOrderHook();

  return (
    <Box>
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
              Service Orders
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={styles.body}>
        <Box className={styles.bodyContent}>
          {isEmpty ? (
            <EmptyData icon={<EmptyBoxIcon />} msg="You have no orders yet" />
          ) : (
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Order;
