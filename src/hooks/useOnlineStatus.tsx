import { useState, useEffect } from 'react';

import { deleteField, doc, updateDoc } from '@firebase/firestore';
import { useUserStore } from '@/store/reducers/usersReducer';
import { Helper } from '@/utility/helper';
import { db } from '@/credentials/firebase';
import { USERS, isOnlineKey } from '@/keys/firestoreKeys';

const useOnlineStatus = () => {
  const { currentUser } = useUserStore();
  const [uid] = [currentUser?.uid];
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    window.addEventListener('online', () => setOnline(true));
    window.addEventListener('focus', () => setOnline(true));
    window.addEventListener('offline', () => setOnline(false));
    window.addEventListener('blur', () => setOnline(false));
    // }, []);
  });

  useEffect(() => {
    if (!uid || !currentUser || !currentUser.uid) {
      return;
    }

    if (online) {
      Helper?.recentlyActive(currentUser);
    } else {
      updateDoc(doc(db, USERS, uid), {
        [isOnlineKey]: deleteField(),
      });
    }
    // eslint-disable-next-line
  }, [online]);

  return online;
};

export default useOnlineStatus;
