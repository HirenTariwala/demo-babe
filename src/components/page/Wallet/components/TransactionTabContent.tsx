import Box from '@/components/atoms/box';
import TransactionCard from '@/components/molecules/card/transaction';
import React from 'react';

interface ITabContent {
  index: number;
}

const TransactionTabContent = ({ index }: ITabContent) => {
  if (index % 2 === 1) {
    return (
      <Box display={'flex'} flexDirection={'column'} gap={5}>
        <TransactionCard
          transactionData={{
            amount: 600,
            status: 'Pending',
            color: 'info',
            time: '2021-01-01 12:00:00',
            transactionID: 1,
          }}
        />
        <TransactionCard
          transactionData={{
            amount: 300,
            status: 'Deno',
            color: 'success',
            time: '2021-01-01 12:00:00',
            transactionID: 1,
          }}
        />
        <TransactionCard
          transactionData={{
            amount: 500,
            status: 'Cancelled',
            color: 'error',
            time: '2021-01-01 12:00:00',
            transactionID: 1,
          }}
        />
      </Box>
    );
  }
  return (
    <Box display={'flex'} flexDirection={'column'} gap={5}>
      <TransactionCard
        transactionData={{
          amount: 1500,
          status: 'Pending',
          color: 'info',
          time: '2021-01-01 12:00:00',
          transactionID: 1,
        }}
      />
      <TransactionCard
        transactionData={{
          amount: 250,
          status: 'User Cancelled',
          color: 'error',
          time: '2021-01-01 12:00:00',
          transactionID: 1,
        }}
      />
      <TransactionCard
        transactionData={{
          amount: 400,
          status: 'Procesing',
          color: 'primary',
          time: '2021-01-01 12:00:00',
          transactionID: 1,
        }}
      />
      <TransactionCard
        transactionData={{
          amount: 50,
          status: 'completed',
          color: 'success',
          time: '2021-01-01 12:00:00',
          transactionID: 1,
        }}
      />
      <TransactionCard
        transactionData={{
          amount: 1000,
          status: 'Work in progress',
          color: 'warning',
          time: '2021-01-01 12:00:00',
          transactionID: 1,
        }}
      />
    </Box>
  );
};

export default TransactionTabContent;
