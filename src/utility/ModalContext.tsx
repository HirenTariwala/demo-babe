import React from 'react';
import ProfileModal from './ProfileModal';
import OrderRequestModal from './OrderRequestModal';

const ModalContext = () => {
  return (
    <>
      <ProfileModal />
      <OrderRequestModal />
    </>
  );
};

export default ModalContext;
