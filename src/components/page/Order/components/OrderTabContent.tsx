import Box from '@/components/atoms/box';
import LoadingIcon from '@/components/atoms/icons/loading';
import Typography from '@/components/atoms/typography';
import TransactionStatusCard from '@/components/molecules/card/transactionstatus';
import { OrderStatusEnum } from '@/enum/orderEnum';
import { babeUIDKey, clientUIDKey, idKey } from '@/keys/firestoreKeys';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';

interface IOrderTabContent {
  index: number;
  data: QueryDocumentSnapshot<DocumentData>[];
  loading: boolean;
  error: boolean;
  isAdmin?: boolean | null;
}
const OrderTabContent = ({ index, data, isAdmin, loading, error }: IOrderTabContent) => {
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
          {error ? 'Service Order Get Error! Please Connect Help Support.' : 'Empty Order'}
        </Typography>
      </Box>
    );
  }
  const getStatus = (item: number) => {
    switch (item) {
      case OrderStatusEnum?.completed: {
        return { status: 'Completed'};
      }
      case OrderStatusEnum?.cancel: {
        return { status: 'Expired' };
      }
      case OrderStatusEnum?.error: {
        return { status: 'Cancelled' };
      }
      case OrderStatusEnum?.pending: {
        return { status: 'Pending' };
      }
      case OrderStatusEnum?.pending_refund: {
        return { status: 'Pending Refunded' };
      }
      case OrderStatusEnum?.refund_rejected: {
        return { status: 'Refund Rejected'};
      }
      case OrderStatusEnum?.refunded: {
        return { status: 'Refunded'};
      }
      case OrderStatusEnum?.rejected: {
        return { status: 'Rejected'};
      }
      case OrderStatusEnum?.unsuccessful: {
        return { status: 'Unsuccessful'};
      }
      default: {
        return { status: 'All', color: 'primary' };
      }
    }
  };
  return (
    <Box key={index} display={'flex'} flexDirection={'column'} gap={5}>
      {data?.map((item, index) => {
        const doc = item?.data();
        let currentObj: any = '';

        if (isAdmin) {
          currentObj = doc?.inf?.[doc?.[clientUIDKey]];
        } else {
          currentObj = doc?.inf?.[doc?.[babeUIDKey]];
        }
        const nickName = currentObj?.nick || '--';
        const profile = currentObj?.u || '';
        const combinedTimestamp = doc?.t?.seconds * 1000 + Math.floor(doc?.t?.nanoseconds / 1000000);
        const date = dayjs(new Date(combinedTimestamp)).format('MMM DD, hh:mm A');
        const statusWithColorObj = getStatus(doc?.st);
        const price = doc?.services?.details?.price || 0;

        return (
          <TransactionStatusCard
            key={index}
            doc={doc}
            isAdmin={isAdmin}
            transactionStatusData={{
              amount: price,
              name: nickName,
              profilePic: profile,
              remainingTime: '',
              status: statusWithColorObj?.status,
              time: date,
              transactionID: doc?.[idKey],
            }}
          />
        );
      })}
    </Box>
  );
};

export default OrderTabContent;
