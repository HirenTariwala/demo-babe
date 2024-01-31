import { db } from '@/credentials/firebase';
import { COINS, PROMO, USERS, descriptionKey, nameKey, promoMapKey } from '@/keys/firestoreKeys';
import { useUserStore } from '@/store/reducers/usersReducer';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { isTEST } from '@/keys/functionNames';

interface PromoMap {
  [key: string]: {
    [amt: string]: number;
  };
}

const useCreditHook = () => {
  const key = isTEST ? 'pk_test_Wy45sQqUs0fLxhB6Z87PfAUf' : 'pk_live_2MGVUBzqFSWgJgPK1G5sUXqv';
  // const key = 'pk_test_Wy45sQqUs0fLxhB6Z87PfAUf';
  const stripePromise = loadStripe(key);

  const [loading, setLoading] = useState<boolean>(false);
  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  const isPremium = currentUser?.isPremium ?? false;
  const [promoMapState, setPromoMapState] = useState<PromoMap | undefined>();

  const [discountState, setDiscountState] = useState<number>(0);
  const [promoDescription, setDescription] = useState<string>();
  const [functionName, setName] = useState<string>('');

  useEffect(() => {
    setLoading(false);

    const docId = isPremium ? `${COINS}2` : `${USERS}2`;

    getDoc(doc(db, PROMO, docId))
      .then((document) => {
        if (document.exists()) {
          const promoMap = document?.get(promoMapKey) as PromoMap;
          const description = document?.get(descriptionKey) as string;
          const name = document?.get(nameKey) as string;
          setPromoMapState(promoMap);
          setDescription(description);
          setDiscountState(promoMap[0].discount);
          setName(name);
        }
        return false;
      })
      .catch((error) => {
        console.log('functionName get Error ==> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isPremium]);

  return {
    stripePromise,
    functionName,
    loading,
    promoMapState,
    discountState,
    promoDescription,
  };
};

export default useCreditHook;
