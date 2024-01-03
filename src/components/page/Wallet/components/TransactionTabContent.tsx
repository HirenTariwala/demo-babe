import Box from '@/components/atoms/box';
import LoadingIcon from '@/components/atoms/icons/loading';
import Typography from '@/components/atoms/typography';
import TransactionCard from '@/components/molecules/card/transaction';
import { OrderItemEnum } from '@/enum/orderEnum';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';

interface ITabContent {
  index: number;
  data: QueryDocumentSnapshot<DocumentData>[];
  loading: boolean;
  error: boolean;
}

const TransactionTabContent = ({ index, data, loading, error }: ITabContent) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LoadingIcon />
      </Box>
    );
  }
  if (!(data?.length > 0) || error) {
    return (
      <Box>
        <Typography variant="body1" fontWeight={500} color={error ? 'red' : '#1A1A1A'}>
          {error ? 'Transaction Get Error! Please Connect Help Support.' : 'Empty Transaction'}
        </Typography>
      </Box>
    );
  }

  const getStatus = (item: number) => {
    console.log(item)
    switch (item) {
      case OrderItemEnum.custom_recharge: {
        return { status: 'Custom Recharge', color: 'info' };
      }

      case OrderItemEnum.bundle_recharge: {
        return { status: 'Bundle Recharge', color: 'info' };
      }

      case OrderItemEnum.refund: {
        return { status: 'Refunded', color: 'primary' };
      }
      case OrderItemEnum.credits_movement: {
        return { status: 'Withdrawn', color: 'error' };
      }

      default: {
        return { status: 'All', color: 'success' };
      }
    }
  };

  return (
    <Box key={index} display={'flex'} flexDirection={'column'} gap={5}>
      {data?.map((item, index) => {
        const doc = item?.data();
        const combinedTimestamp = doc?.t?.seconds * 1000 + Math.floor(doc?.t?.nanoseconds / 1000000);
        const date = dayjs(new Date(combinedTimestamp)).format('MMM DD, hh:mm A');
        const statusWithColorObj = getStatus(doc?.item);

        return (
          <TransactionCard
            key={index}
            transactionData={{
              amount: doc?.amt || 0,
              status: statusWithColorObj?.status,
              color: statusWithColorObj?.color,
              time: date,
              transactionID: doc?.id,
            }}
          />
        );
      })}
    </Box>
  );
};

export default TransactionTabContent;
