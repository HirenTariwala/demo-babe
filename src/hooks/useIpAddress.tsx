import { COLOMBIA, MALAYSIA, PHILIPPINES, SINGAPORE, ipgeolocationAPIKEYS } from '@/keys/countries';
import { areaLocalKey, countryLocalKey } from '@/keys/localStorageKeys';
import { setCurrentUser, useUserStore } from '@/store/reducers/usersReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { Helper } from '@/utility/helper';
import { useEffect, useState } from 'react';
// import { logEvent } from "firebase/analytics";
// import { analytics } from '@/credentials/firebase';
// import { AnalyticsNames } from '@/keys/analyticNames';
import { stateKey } from '@/keys/firestoreKeys';

export const useIPAddress: () => { loadingIPAddress: boolean } = () => {
  const dispatch = useAppDispatch();
  const state = Helper.getQueryParamValueFromURL('state');

  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  const [uid] = [currentUser?.uid];

  const [loadingIPAddress, setLoading] = useState(true);

  useEffect(() => {
    const msia = MALAYSIA.join(', ');
    const colombia = COLOMBIA.join(', ');
    const singapore = SINGAPORE.join(', ');
    const philippines = PHILIPPINES.join(', ');

    if (state === 'kl') {
      localStorage.setItem(areaLocalKey, msia);
      setLoading(false);
    } else if (state === 'co') {
      localStorage.setItem(areaLocalKey, colombia);
      setLoading(false);
    } else {
      const area = localStorage.getItem(areaLocalKey);
      if (!area && !uid) {
        const controller = new AbortController();
        const { signal } = controller;
        
        const API = ipgeolocationAPIKEYS[(Math.random() * ipgeolocationAPIKEYS.length) | 0];

        fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API}`, { signal })
          .then(async (data) => {
            const json = await data.json();
            const countryName = json.country_name;

            if (countryName === 'Malaysia') {
              localStorage.setItem(areaLocalKey, msia);
              sessionStorage.setItem(stateKey, msia)
            } else if (countryName === 'Singapore') {
              localStorage.setItem(areaLocalKey, singapore);
              sessionStorage.setItem(stateKey, singapore)
            } else if (countryName === 'Colombia') {
              localStorage.setItem(areaLocalKey, colombia);
              sessionStorage.setItem(stateKey, colombia)
            } else if (countryName === 'Philippines') {
              localStorage.setItem(areaLocalKey, philippines);
              sessionStorage.setItem(stateKey, philippines)
            }

            try {
              if (countryName) {
                console.log(countryName, "Hello");
                // logEvent(analytics, AnalyticsNames.ipaddress, {
                //   country_type: countryName,
                //   content_type: countryName,
                //   item_id: countryName, 
                // })  
              }
            } catch (error) {
              console.log('error ', error);
            }
            const countryCode = json.country_code2;
            if (countryCode) {
              console.log("Hello set country");
              localStorage.setItem(countryLocalKey, countryCode)
              // setCurrentUser({ countryCode });
              dispatch(
                setCurrentUser({
                  countryCode
                })
              );
            } else {
              console.log("country not found");
              
            }
          })
          .catch((error) => {
            console.log("useIPAddress hook",error);
          })
          .finally(() => {
            setLoading(false);
          });

        return () => {
          controller.abort(); // abort on unmount for cleanup
        };
      } else {
        setLoading(false);
      }
    }

    // eslint-disable-next-line
  }, []);

  return { loadingIPAddress };
};
