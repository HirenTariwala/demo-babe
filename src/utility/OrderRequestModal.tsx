import RequestOrderModal from '@/components/page/Profile/components/requestOrderModal';
import { useRequestModal } from '@/store/reducers/serviceReducer';
import React from 'react';

const OrderRequestModal = () => {
  const isRequestModalOpen = useRequestModal();
  return <>{isRequestModalOpen && <RequestOrderModal isOpen={isRequestModalOpen} />}</>;
};

export default OrderRequestModal;
