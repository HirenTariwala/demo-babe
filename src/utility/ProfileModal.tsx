import ProfileModalComponents from '@/components/page/Profile/components/profileModalComponents';
import { useDrawerOpenStore } from '@/store/reducers/drawerOpenReducer';
import React from 'react';

const ProfileModal = () => {
  const { isOpenProfileModal } = useDrawerOpenStore();

  return (
    <>
      <ProfileModalComponents isOpen={isOpenProfileModal} />
    </>
  );
};

export default ProfileModal;
