import Box from '@/components/atoms/box';
import LoadingIcon from '@/components/atoms/icons/loading';
import Typography from '@/components/atoms/typography';
import TransactionCard from '@/components/molecules/card/transaction';
import VariableWindowList from '@/components/organisms/list/VariableWindowList';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import styles from '../wallet.module.css';

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

  return (
    <Box position={'relative'} key={index} className={styles.transactionList}>
      <VariableWindowList
        data={data ?? []}
        height={(window?.innerHeight / 3) * 4}
        width={'100%'}
        hasNextPage={true}
        loadNextPage={() => {}}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignores
        component={TransactionCard}
      />
    </Box>
  );
};

export default TransactionTabContent;
