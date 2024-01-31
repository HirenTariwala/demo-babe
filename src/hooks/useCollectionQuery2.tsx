import { CollectionReference, DocumentData, Query, QuerySnapshot, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// const cache: { [key: string]: any } = {};

export const useCollectionQuery2: (
  key: string | undefined,
  collection: CollectionReference | Query<DocumentData> | undefined,
  limitCount?: number
) => {
  loading: boolean;
  error: boolean;
  data: QuerySnapshot | null;
  hasNextPage: boolean;
} = (key, collection, limitCount) => {
  const cache: { [key: string]: any } = {};
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(key ? cache[key] || undefined : undefined);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  useEffect(() => {
    if (!key || !collection) return () => {};
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

        const current = snapshot.docs.length;
        const value = current >= (limitCount ?? 0);

        setNextPage(value);
        cache[key] = snapshot;
      },
      (error) => {
        setData(null);
        setLoading(false);
        console.log('Firebase Collection Query Error ==> ', error);

        setError(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [key, limitCount]);

  return {
    loading,
    error,
    data,
    hasNextPage,
  };
};
