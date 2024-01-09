import { useUserStore } from '@/store/reducers/usersReducer';
import useRentHook from '../Rent/useRentHook';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { useCollectionQuery2 } from '@/hooks/useCollectionQuery2';
import { db } from '@/credentials/firebase';
import { ORDER, babeUIDKey, clientUIDKey, statusKey, timeStampKey } from '@/keys/firestoreKeys';
import { OrderStatusEnum } from '@/enum/orderEnum';
import { useMemo } from 'react';
import OrderTabContent from './components/OrderTabContent';

const useOrderhook = () => {
  const { isMobile } = useRentHook();
  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;

  const [uid, isAdmin] = [currentUser?.uid, currentUser?.isAdmin];

  // const uid = 'nvWQi1KhGuPDnzAIwuJ89DVWz5i1';

  const {
    loading: orderLoading,
    data: orderData,
    error: orderError,
  } = useCollectionQuery2(
    uid ? `${uid}-session` : undefined,
    query(collection(db, ORDER), where(isAdmin ? babeUIDKey : clientUIDKey, '==', uid), orderBy(timeStampKey, 'desc'))
  );

  const orderStatusList = [
    {
      key: '-',
      label: 'All',
    },
    {
      key: OrderStatusEnum.completed,
      label: 'Completed',
    },
    {
      key: OrderStatusEnum.error,
      label: 'Expired',
    },
    {
      key: OrderStatusEnum.cancel,
      label: 'Cancelled',
    },
    {
      key: OrderStatusEnum.pending,
      label: 'Pending',
    },
    {
      key: OrderStatusEnum.pending_refund,
      label: 'Pending Refunded',
    },
    {
      key: OrderStatusEnum.refunded,
      label: 'Refunded',
    },
    {
      key: OrderStatusEnum.unsuccessful,
      label: 'Unsuccessful',
    },
    {
      key: OrderStatusEnum.rejected,
      label: 'Rejected',
    },
    {
      key: OrderStatusEnum.refund_rejected,
      label: 'Refund Rejected',
    },
  ];

  const getNoOfBadge = (key: string | undefined) => {
    if (!key) return [];

    if (!orderData) return [];

    if (key == '-') return orderData?.docs;

    return orderData?.docs?.filter((item) => item?.get(statusKey) == key);
  };
  const isEmpty = orderData ? orderData?.docs?.length < 1 : false;

  const tabs = useMemo(
    () =>
      orderStatusList?.map((item, index) => {
        const noOfItems = getNoOfBadge(item?.key?.toString());

        return {
          lable: () => (
            <span
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <span>{item?.label}</span>
              {/* <span>
                <Badge badgeContent={noOfItems?.length?.toString()} color={value === index ? 'primary' : 'secondary'} />
              </span> */}
            </span>
          ),
          content: (
            <OrderTabContent
              isAdmin={isAdmin}
              index={index}
              data={noOfItems}
              loading={orderLoading}
              error={orderError}
            />
          ),
        };
      }),
    [orderData]
  );

  return { isMobile, isEmpty, tabs };
};

export default useOrderhook;
