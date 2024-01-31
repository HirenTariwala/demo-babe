import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import TransactionCard from '@/components/molecules/card/transaction';
import VariableWindowList from '@/components/organisms/list/VariableWindowList';
import {
  DocumentData,
  QueryConstraint,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styles from '../wallet.module.css';
import { useTranslations } from 'next-intl';
import { useWindowSize } from '@/hooks/useWindowSize';
import { db } from '@/credentials/firebase';
import { TRANSACTION, amountKey, moveToWhereKey, orderItemKey, timeStampKey, uidKey } from '@/keys/firestoreKeys';
import { useUserStore } from '@/store/reducers/usersReducer';
import { OrderItemEnum } from '@/enum/orderEnum';
import LoadingIcon from '@/components/atoms/icons/loading';
import Toast from '@/components/molecules/toast';

interface ITabContent {
  orderItem: number;
  value: OrderItemEnum | null;
  // onOpenToastWithMsg: (arg: string) => void;
}

const defaultLimit = Math.ceil(window.innerHeight / 150);

const TransactionTabContent = ({ orderItem, value }: ITabContent) => {
  const t = useTranslations('walletPage');
  const [size] = useWindowSize();
  const { currentUser } = useUserStore();
  const [lastIndex, setLastIndex] = useState<DocumentData>();
  const [newData, setNewData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const onOpenToastWithMsg = (msg: string) => {
    setToastMsg(msg);
    setOpenToast(true);
  };

  const fetchLoadMore = () => {
    if (hasMore) {
      setPageNo(pageNo + 1);
    }
  };

  const handleScroll = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const isBottom = window.scrollY >= scrollableHeight;
    if (isBottom && hasMore) {
      fetchLoadMore();
    }
  };

  useEffect(() => {
    if (hasMore) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [newData]);

  useEffect(() => {
    const queries: QueryConstraint[] = [];
    if (orderItem !== -1) {
      queries?.push(where(orderItemKey, '==', orderItem));
    }
    if (value === OrderItemEnum.earned) {
      queries.push(orderBy(amountKey, 'desc'));
      queries.push(orderBy(timeStampKey, 'desc'));
      queries.push(where(orderItemKey, '==', 2));
      queries.push(where(amountKey, '>', 0));
    }
    if (value === OrderItemEnum.transaction) {
      queries.push(orderBy(amountKey, 'desc'));
      queries.push(orderBy(timeStampKey, 'desc'));
      queries.push(where(orderItemKey, '==', 2));
      queries.push(where(amountKey, '<', 0));
    }
    if (value === OrderItemEnum.withdrawn) {
      queries.push(where(orderItemKey, '==', 4));
      queries.push(where(moveToWhereKey, '==', 1));
    }
    if (value === OrderItemEnum.credits_movement) {
      queries.push(where(orderItemKey, '==', 4));
      queries.push(where(moveToWhereKey, '==', 0));
    }
    if (lastIndex) {
      queries?.push(startAfter(lastIndex));
    }
    setLoading(true);
    getDocs(
      query(
        collection(db, TRANSACTION),
        where(uidKey, '==', `${currentUser?.uid || ''}`),
        ...queries,
        limit(defaultLimit)
      )
    )
      .then((snap) => {
        const newObj = snap?.docs?.[snap?.docs?.length - 1];
        setLastIndex(newObj);
        const newDataArr = newData?.concat(snap?.docs);
        setNewData(newDataArr);

        if (snap && snap?.docs?.length < defaultLimit) {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Order Data Get Error ==> ', err);
        setLoading(false);
      });
  }, [pageNo]);

  if (!(newData?.length > 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 0px',
        }}
      >
        {loading ? (
          <LoadingIcon />
        ) : (
          <Typography variant="body1" fontWeight={500} color="#1A1A1A">
            {t('transactionEmpty')}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box position={'relative'} className={styles.transactionList}>
      <VariableWindowList
        data={newData ?? []}
        height={3 * (size?.height / 4)}
        width={'100%'}
        hasNextPage={hasMore || false}
        overScan={newData.length}
        loadNextPage={handleScroll}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignores
        component={TransactionCard(loading, hasMore, onOpenToastWithMsg)}
      />
      <Toast alertMessage={toastMsg} onClose={() => setOpenToast(false)} open={openToast} />
    </Box>
  );
};

export default TransactionTabContent;
