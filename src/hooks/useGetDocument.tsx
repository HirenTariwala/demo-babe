import {
  DocumentData,
  getDocs,
  CollectionReference,
  query,
  QueryConstraint,
  orderBy,
  where,
  Timestamp,
  limit,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const cache: {
  [key: string]: QueryDocumentSnapshot<DocumentData>[] | undefined;
} = {};

export const useGetDocuments: (
  key: string,
  collection: CollectionReference,
  queryConstraint?: QueryConstraint[],
  getMoreDocumentFromKey?: string,
  limitCount?: number
) => {
  loading: boolean;
  error: boolean;
  data: QueryDocumentSnapshot<DocumentData>[] | null;
  hasNextPage: boolean;
} = (key, collection, queryConstraint, getMoreDocumentFromKey, limitCount) => {
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setNextPage] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<QueryDocumentSnapshot<DocumentData>[]>(cache[key] || []);

  useEffect(() => {
    if (!collection || !limitCount) {
      return;
    }

    const constraint: QueryConstraint[] = queryConstraint ?? [];

    if (getMoreDocumentFromKey && limitCount) {
      const lastNumberOfDocument = data?.length ?? 0;

      if (lastNumberOfDocument > 0) {
        const lastTimestamp =
          (data?.[lastNumberOfDocument - 1].get(getMoreDocumentFromKey) as Timestamp) ?? Timestamp.now();
        queryConstraint?.push(where(getMoreDocumentFromKey, '<', lastTimestamp));
      }
      queryConstraint?.push(orderBy(getMoreDocumentFromKey, 'desc'));
    }

    queryConstraint?.push(limit(limitCount));

    setLoading(true);
    getDocs(query(collection, ...constraint))
      .then((snapshot) => {
        setLoading(false);
        setError(false);

        const { docs } = snapshot;
        const current = docs.length;
        const value = current >= (limitCount ?? 0);

        setNextPage(value);
        const merge = { ...data, ...docs } ?? [];
        setData(merge);

        return true;
      })
      .catch(() => {
        // error occur
        setError(true);
        setLoading(false);
      });
  }, [key, limitCount]);

  return {
    loading,
    error,
    data,
    hasNextPage,
  };
};
