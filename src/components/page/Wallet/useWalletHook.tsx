// import Badge from '@/components/atoms/badge';
import useRentHook from '../Rent/useRentHook';
import { useEffect, useMemo, useState } from 'react';
import { setCurrentUser, useUserStore } from '@/store/reducers/usersReducer';
import { CREDIT, balanceKey, incomeKey, penaltyKey, pendingKey, pointsKey } from '@/keys/firestoreKeys';
import { db } from '@/credentials/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import { useAppDispatch } from '@/store/useReduxHook';
import { useTranslations } from 'next-intl';
import TransactionTabContent from './components/TransactionTabContent';
import { OrderItemEnum } from '@/enum/orderEnum';

interface ITabs {
  type: string;
  value: OrderItemEnum | null;
}
const typeOrder: any = {
  0: -1,
  1: 3,
  2: 2,
  3: 1,
  4: 0,
  5: 4,
  6: 4,
  7: 2,
};

const useWalletHook = () => {
  const { isMobile } = useRentHook();
  const t = useTranslations('walletPage.transactionTabsKey');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [getAllTransaction, setGetAllTransaction] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(true);
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

  const [activeTransactionTab, setActiveTransactionTab] = useState<number>(0);

  const { data: walletData } = useDocumentQuery(
    `${uid || ''}-balance-main`,
    uid ? doc(db, CREDIT, uid ?? 'empty') : undefined
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore]
  const types: ITabs[] = useMemo(
    () => [
      {
        type: t('all'),
        // badge: transactionData ? transactionData?.size : '0',
        value: null,
      },
      {
        type: t('refunded'),
        // badge: countAndContentObj?.refund || '0',
        value: OrderItemEnum?.refund,
      },
      {
        type: t('earned'),
        // badge: countAndContentObj?.transactionEarned || '0',
        value: OrderItemEnum.earned,
      },
      {
        type: t('bundleRecharge'),
        // badge: countAndContentObj?.bundleRecharge || '0',
        value: OrderItemEnum?.bundle_recharge,
      },
      {
        type: t('customRecharge'),
        // badge: countAndContentObj?.custom_recharge || '0',
        value: OrderItemEnum?.custom_recharge,
      },
      {
        type: t('movedFromPending'),
        // badge: countAndContentObj?.creditsMovementMovedFromPending || '0',
        value: OrderItemEnum?.credits_movement,
      },
      {
        type: t('withdrawn'),
        // badge: countAndContentObj?.creditsMovementWithdrawn || '0',
        value: OrderItemEnum?.withdrawn,
      },
      {
        type: t('spend'),
        // badge: countAndContentObj?.transactionSpend || '0',
        value: OrderItemEnum.transaction,
      },
    ],
    [activeTransactionTab, walletData]
  );

  const tabs = types?.map((item) => ({
    lable: () => (
      <span
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <span>{item?.type}</span>
        {/* <span>
          <Badge badgeContent={item?.badge} color={value === index ? 'primary' : 'secondary'} />,
        </span> */}
      </span>
    ),
    content: (
      <TransactionTabContent
        orderItem={typeOrder[activeTransactionTab]}
        value={item.value}
        // onOpenToastWithMsg={onOpenToastWithMsg}
      />
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
    // setVerifiedWithdrawIsOpen(true);
    if (!nickname) {
      router.push(`/admin?uid=${uid || ''}`);
    } else if (verified) {
      setVerifiedWithdrawIsOpen(true);
    } else {
      setUnVerifiedWithdrawIsOpen(true);
    }
  };

  return {
    isMobile,
    activeTransactionTab,
    getAllTransaction,
    setGetAllTransaction,
    isOpenAlert,
    setIsOpenAlert,
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
    setActiveTransactionTab,
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
