import { auth } from '@/credentials/firebase';
import { CollectionReference, DocumentData, Query, QuerySnapshot, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const cache: { [key: string]: any } = {};

export const useEffectCollectionQuery: (
  key: string | undefined,
  collection: CollectionReference | Query<DocumentData> | undefined,
  limitCount: number
) => {
  loading: boolean;
  error: boolean;
  data: QuerySnapshot | null;
  hasNextPage: boolean;
} = (key, collection, limitCount) => {
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(key ? cache[key] || undefined : undefined);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);
  const authUser = auth?.currentUser;

  useEffect(() => {
    if (!key || !collection || !authUser) return () => {};
    setLoading(!cache[key]);
    if (cache[key]) {
      setData(cache[key]);
    }

    const unsubscribe = onSnapshot(
      collection,
      (snapshot) => {
        setData(snapshot);
        setLoading(false);
        setError(false);

        const current = snapshot?.docs?.length;
        const value = current >= (limitCount ?? 0);

        setNextPage(value);

        cache[key] = snapshot;
      },
      (error) => {
        console.log('useEffectCollectionQuery Error ==> ', error);
        setData(null);
        setLoading(false);

        setError(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [key, limitCount, authUser]);

  return {
    loading,
    error,
    data,
    hasNextPage,
  };
};
