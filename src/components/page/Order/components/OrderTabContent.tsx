import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import TransactionStatusCard from '@/components/molecules/card/transactionstatus';
import VariableWindowList from '@/components/organisms/list/VariableWindowList';
import {
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import React, { memo, useEffect, useState } from 'react';
import styles from '../order.module.css';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useWindowSize } from '@/hooks/useWindowSize';
import { db } from '@/credentials/firebase';
import { ORDER, babeUIDKey, clientUIDKey, statusKey, timeStampKey } from '@/keys/firestoreKeys';
import { OrderStatusEnum } from '@/enum/orderEnum';
import LoadingIcon from '@/components/atoms/icons/loading';
import { useTranslations } from 'next-intl';

interface IOrderTabContent {
  index: number;
  isAdmin?: boolean | null;
  keyIndex: string | OrderStatusEnum;
}
// eslint-disable-next-line react/display-name
const OrderTabContent = memo(({ index, isAdmin, keyIndex }: IOrderTabContent) => {
  const { currentUser } = useUserStore();
  const t = useTranslations('orderPage');
  const [uid] = [currentUser?.uid];
  const [size] = useWindowSize();
  const [orderData, setOrderData] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);
  const defaultSize = 150;
  const defaultLimitCount = Math.ceil(window.innerHeight / defaultSize);
  const [startIndex, setIndex] = useState<DocumentData>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadNextPage = () => {
    if (hasMore) {
      setPageNo(pageNo + 1);
    }
  };

  const scrollHandler = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const isBottom = window.scrollY >= scrollableHeight;
    if (isBottom && hasMore) {
      loadNextPage();
    }
  };

  useEffect(() => {
    if (hasMore) {
      window?.addEventListener('scroll', scrollHandler);
      return window?.addEventListener('scroll', scrollHandler);
    }
  });

  useEffect(() => {
    const queries: QueryConstraint[] = [];
    if (keyIndex !== '-') {
      queries?.push(where(statusKey, '==', keyIndex));
    }
    if (startIndex) {
      queries?.push(startAfter(startIndex));
    }
    setLoading(true);
    getDocs(
      query(
        collection(db, ORDER),
        where(isAdmin ? babeUIDKey : clientUIDKey, '==', uid),
        orderBy(timeStampKey, 'desc'),
        ...queries,
        limit(defaultLimitCount)
      )
    )
      .then((snap) => {
        const newObj = snap?.docs?.[snap?.docs?.length - 1];
        setIndex(newObj);
        const newDataArr = orderData?.concat(snap?.docs);
        setOrderData(newDataArr);

        if (snap?.docs?.length < defaultLimitCount) {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Order Data Get Error ==> ', err);

        setLoading(false);
      });
  }, [pageNo]);

  if (!orderData || !(orderData?.length > 0)) {
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
            {t('emptyOrder')}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <>
      <Box position={'relative'} key={index} className={styles.orderList} id="order-list">
        <VariableWindowList
          data={orderData ?? []}
          height={size?.height - 32}
          width={'100%'}
          hasNextPage={hasMore}
          loadNextPage={() => {}}
          overScan={orderData?.length}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignores
          component={TransactionStatusCard(isAdmin, hasMore, loading)}
        />
      </Box>
    </>
  );
});
export default OrderTabContent;
