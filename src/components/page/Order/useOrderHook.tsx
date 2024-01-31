import { useUserStore } from '@/store/reducers/usersReducer';
import useRentHook from '../Rent/useRentHook';
import { OrderStatusEnum } from '@/enum/orderEnum';
import { useState } from 'react';
import OrderTabContent from './components/OrderTabContent';
import { useTranslations } from 'next-intl';

const useOrderhook = () => {
  const { isMobile } = useRentHook();
  const userStore = useUserStore();
  const t = useTranslations('orderPage.orderTab');
  const currentUser = userStore?.currentUser;
  const [getAllOrder, setGetAllOrder] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(true);

  const [isAdmin] = [currentUser?.isAdmin];
  console.log(currentUser);

  // const uid = 'nvWQi1KhGuPDnzAIwuJ89DVWz5i1'

  const orderStatusList = [
    {
      key: '-',
      label: t('all'),
    },
    {
      key: OrderStatusEnum.completed,
      label: t('completed'),
    },
    {
      key: OrderStatusEnum.cancel,
      label: t('cancelled'),
    },
    {
      key: OrderStatusEnum.pending,
      label: t('pending'),
    },
    {
      key: OrderStatusEnum.pending_refund,
      label: t('pendingRefunded'),
    },
    {
      key: OrderStatusEnum.refunded,
      label: t('refunded'),
    },
    {
      key: OrderStatusEnum.unsuccessful,
      label: t('unsuccessful'),
    },
    {
      key: OrderStatusEnum.rejected,
      label: t('rejected'),
    },
    {
      key: OrderStatusEnum.refund_rejected,
      label: t('refundRejected'),
    },
  ];

  const tabs = orderStatusList?.map((item, index) => {
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
      content: <OrderTabContent isAdmin={isAdmin} index={index} keyIndex={item?.key} />,
    };
  });

  return { isMobile, tabs, getAllOrder, setGetAllOrder, isOpenAlert, setIsOpenAlert };
};

export default useOrderhook;
