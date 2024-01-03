import Badge from '@/components/atoms/badge';
import useRentHook from '../Rent/useRentHook';
import TransactionTabContent from './components/TransactionTabContent';
import { useEffect, useMemo, useState } from 'react';
import { setCurrentUser, useUserStore } from '@/store/reducers/usersReducer';
import {
  CREDIT,
  TRANSACTION,
  balanceKey,
  incomeKey,
  penaltyKey,
  pendingKey,
  pointsKey,
  timeStampKey,
  uidKey,
} from '@/keys/firestoreKeys';
import { db } from '@/credentials/firebase';
import { DocumentData, QueryDocumentSnapshot, collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCollectionQuery2 } from '@/hooks/useCollectionQuery2';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import { useAppDispatch } from '@/store/useReduxHook';

interface ITabs {
  type: string;
  badge: number;
  content: QueryDocumentSnapshot<DocumentData>[];
}

const useWalletHook = () => {
  const { isMobile } = useRentHook();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const onCloseToast = () => {
    setOpenToast(false);
  };
  const onOpenToastWithMsg = (msg: string) => {
    setToastMsg(msg);
    setOpenToast(true);
  };
  const [uid, verified, rejectedReasonAfter, balance, pending, income, penaltyCredits, nickname] = [
    currentUser?.uid,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
    currentUser?.balance,
    currentUser?.pendingCredits,
    currentUser?.incomeCredits,
    currentUser?.penaltyCredits,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentUser?.nickname || currentUser?.nick || '',
  ];

  const [verifiedWithdrawIsOpen, setVerifiedWithdrawIsOpen] = useState(false);
  const [unVerifiedWithdrawIsopen, setUnVerifiedWithdrawIsOpen] = useState(false);
  // const defaultSize = 150;
  // const defaultLimitCount = Math.ceil(window.innerHeight / defaultSize);
  // const [limitCount, setLimitCount] = useState(defaultLimitCount);

  const { data: walletData } = useDocumentQuery(
    `${uid || ''}-balance-main`,
    uid ? doc(db, CREDIT, uid ?? 'empty') : undefined
  );

  const {
    loading: transactionLoading,
    data: transactionData,
    error: transactionError,
  } = useCollectionQuery2(
    uid ? `${uid}-order` : undefined,
    query(
      collection(db, TRANSACTION),
      where(uidKey, '==', `${uid || ''}`),
      orderBy(timeStampKey, 'desc')
      // limit(limitCount)
    )
    // limitCount
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const types: ITabs[] = useMemo(
    () => [
      {
        type: 'All',
        badge: transactionData ? transactionData?.size : '0',
        content: transactionData ? transactionData?.docs : [],
      },
      {
        type: 'Refunded',
        badge: transactionData
          ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 3)?.length?.toString()
          : '0',
        content: transactionData ? [] : [],
      },
      {
        type: 'Earned',
        badge: '0',
        content: transactionData ? [] : [],
      },
      {
        type: 'Bundle Recharge',
        badge: transactionData
          ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 1)?.length?.toString()
          : '0',
        content: transactionData ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 1) : [],
      },
      {
        type: 'Custom Recharge',
        badge: transactionData
          ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 0)?.length?.toString()
          : '0',
        content: transactionData ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 0) : [],
      },
      {
        type: 'Moved from Pending',
        badge: '0',
        content: transactionData ? [] : [],
      },
      {
        type: 'Withdrawn',
        badge: transactionData
        ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 4)?.length?.toString()
        : '0',
        content: transactionData ? transactionData?.docs?.filter((obj) => obj?.data()?.item === 4)  : [],
      },
      {
        type: 'Spent',
        badge: '0',
        content: transactionData ? [] : [],
      },
    ],
    [transactionData]
  );

  const tabs = types?.map((item, index) => ({
    lable: (value: number) => (
      <span
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <span>{item?.type}</span>
        <span>
          <Badge badgeContent={item?.badge} color={value === index ? 'primary' : 'secondary'} />,
        </span>
      </span>
    ),
    content: (
      <TransactionTabContent index={index} data={item?.content} loading={transactionLoading} error={transactionError} />
    ),
  }));

  const onClickRecharge = () => {
    router.push('/credit');
  };
  useEffect(() => {
    if (!walletData) {
      return;
    }

    if (walletData && walletData.exists()) {
      const points = (walletData.data()[pointsKey] as number) ?? 0;
      const balance = (walletData.data()[balanceKey] as number) ?? 0;
      const penalty = (walletData.data()[penaltyKey] as number) ?? 0;
      const income = (walletData.data()[incomeKey] as number) ?? 0;
      const pending = (walletData.data()[pendingKey] as number) ?? 0;

      dispatch(
        setCurrentUser({
          points,
          balance,
          penaltyCredits: penalty,
          incomeCredits: income,
          pendingCredits: pending,
        })
      );
    } else {
      dispatch(
        setCurrentUser({
          points: 0,
          balance: 0,
          penaltyCredits: 0,
          incomeCredits: 0,
          pendingCredits: 0,
        })
      );
    }
  }, [walletData]);

  const withdrawButtonClick = () => {
    setVerifiedWithdrawIsOpen(true);
    // if (!nickname) {
    //   router.push(`/admin?uid=${uid || ''}`);
    // } else if (verified) {
    //   setVerifiedWithdrawIsOpen(true);
    // } else {
    //   setUnVerifiedWithdrawIsOpen(true);
    // }
  };

  return {
    isMobile,
    tabs,
    currentUser,
    uid,
    verified,
    rejectedReasonAfter,
    balance,
    pending,
    income,
    penaltyCredits,
    nickname,
    toastMsg,
    onOpenToastWithMsg,
    openToast,
    onCloseToast,
    verifiedWithdrawIsOpen,
    setVerifiedWithdrawIsOpen,
    unVerifiedWithdrawIsopen,
    setUnVerifiedWithdrawIsOpen,
    onClickRecharge,
    withdrawButtonClick,
  };
};

export default useWalletHook;
