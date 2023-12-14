import { getDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SERVICES, serviceVersion } from '../keys/firestoreKeys';
import { ServiceDetailProps, ServicesProps } from '../props/servicesProps';
import { db } from '../credentials/firebase';
import { useAppDispatch } from '@/store/useReduxHook';
import { setServices } from '@/store/reducers/serviceReducer';

export const useGetFavourites: () => {
  favourites: ServiceDetailProps[];
} = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const isAnnouncement = searchParams.get('session');
  const isAdminPage = searchParams.get('admin') === 'true';
  const isVerify = searchParams.get('verify') === 'true';

  const [favourites, setfavourites] = useState<ServiceDetailProps[]>([]);

  useEffect(() => {
    if (isAnnouncement || isAdminPage || isVerify) {
      return;
    }

    getDoc(doc(db, SERVICES, serviceVersion))
      .then((snapshot) => {
        if (!snapshot.exists()) return false;

        const dict = snapshot.data() as ServicesProps;
        const map: ServiceDetailProps[] = [];
        const getAllService: ServiceDetailProps[] = [];

        Object.entries(dict).forEach(([category, value]) => {
          // const thisCat = Number.parseInt(category, 10);
          const thisCat = parseInt(category);
          
          Object.entries(value).forEach(([elementId, elementValue]) => {
            
            if (typeof elementValue !== 'object' ) return;

            getAllService.push({
              ...elementValue,
              id: elementId,
              serviceType: thisCat,
            })

            if(!elementValue.rank) return;

            map.push({
              ...elementValue,
              id: elementId,
              serviceType: thisCat,
            });
          });
        });

        // Set All Servic Start
        dispatch(setServices(getAllService))
        // Set All Servic End

        const sortedMap = map.sort((one, two) => {
          const rankOne = one.rank === undefined ? Number.POSITIVE_INFINITY : one.rank;
          const rankTwo = two.rank === undefined ? Number.POSITIVE_INFINITY : two.rank;

          return rankOne - rankTwo;
        });

        setfavourites(sortedMap);

        return true;
      })
      .catch(() => {
        // error occur
      });
  }, []);

  return { favourites };
};
