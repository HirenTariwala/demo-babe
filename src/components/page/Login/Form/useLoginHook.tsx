import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPhoneNumber,
  signInWithRedirect,
  signOut,
  ConfirmationResult,
  getRedirectResult,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/credentials/firebase';

import { persistor } from '@/store';

import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import {
  logoutAction,
  setCurrentUser,
  setFirebaseUser,
  useFirebaseUser,
  useUserStore,
} from '@/store/reducers/usersReducer';
import {
  filterDrinksLocalKey,
  filterGenderLocalKey,
  filterPrice,
  filterProfile,
  filterRaceLocalKey,
} from '@/keys/localStorageKeys';
import { sortByRatingsKey } from '@/keys/firestoreKeys';
import { useAppDispatch } from '@/store/useReduxHook';
// import fetchUserData from '@/store/thunks/fetchUser';

export function clearStorage() {
  localStorage.removeItem(filterDrinksLocalKey);
  localStorage.removeItem(filterProfile);
  localStorage.removeItem(filterGenderLocalKey);
  localStorage.removeItem(filterPrice);
  localStorage.removeItem(filterRaceLocalKey);
  localStorage.removeItem(sortByRatingsKey);
  localStorage.removeItem('persist:user');
}

const formatPhone = (phone: string) => {
  return `+${phone}`;
};
let result: ConfirmationResult | undefined = undefined;
let recaptchaVerifier: any;
const useLoginHook = () => {
  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  const [uid] = [currentUser?.uid];
  const firebaseUser = useFirebaseUser();

  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [number, setNumber] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isWrongCode, setIsWrongCode] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(true);
  const [isReSend, setIsReSend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const onEditPhone = () => {
    setIsVerified(false);
    setIsReSend(false);
    setTimer(0);
    setIsWrongCode(false);
    setCode('');
  };
  const phoneNumberSignIn = async () => {
    setLoading(true);
    isVerified && setIsReSend(true);
    setIsWrongCode(false);

    const formatedNumber = formatPhone(number);

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
        await recaptchaVerifier.render();
      }
      const resultV2 = await signInWithPhoneNumber(auth, formatedNumber, recaptchaVerifier);
      result = resultV2;
      setTimer(60);
      setIsVerified(true);
    } catch (error) {
      console.log('Error =>', error);
      setTimer(0);
      setIsVerified(false);
      alert(JSON.stringify(error, null, 2));
    }
    setLoading(false);
  };

  const reSendCode = async () => {
    setIsWrongCode(false);
    setIsReSend(true);
    setLoading(true);
    try {
      let recaptchaVerifier;

      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      setTimer(60);
      await recaptchaVerifier.render();
    } catch (error) {
      console.log('ReSend Code Error => ', error);
    }
    setLoading(false);
  };

  const verifyPressed = async () => {
    setLoading(true);
    try {
      const verifyResponse = await result?.confirm(code);
      if (verifyResponse?.operationType === 'signIn' && verifyResponse?.user) {
        dispatch(setCurrentUser(verifyResponse?.user));
        router.push('/');
      } else {
        setIsWrongCode(true);
      }
    } catch (err) {
      console.log('Wrong verification code', err);
      setIsWrongCode(true);
    }

    setLoading(false);
  };
  const googleSignIn = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      signInWithRedirect(auth, provider).catch((error) => {
        console.log('SignInWithPopup Error ==> ', error);
      });
    } catch (error) {
      console.log('Error ==> ', error);
    }
    setLoading(false);
  };

  const logOut = async () => {
    // dispatch(logout());
    // await auth.signOut();

    try {
      await signOut(auth);
      clearStorage();
      await persistor.purge();
      dispatch(logoutAction());
      router.push('/');
    } catch (error) {
      console.log('Logout User Error ==> ', error);
    }
  };
  const handleRedirectResult = async () => {
    try {
      setRedirectLoading(true);
      const resultt = await getRedirectResult(auth);
      if (!resultt) {
        setRedirectLoading(false);
        return;
      }
      const credential = GoogleAuthProvider.credentialFromResult(resultt);
      if (!credential) {
        setRedirectLoading(false);
        return;
      }
      const { uid } = resultt.user;
      if (uid) {
        router.push('/');
      }
    } catch (error) {
      console.log('error=> ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      dispatch(setFirebaseUser(authUser));

      if (authUser) {
        const { uid, email, phoneNumber } = authUser;

        let countryCode;
        if (phoneNumber) {
          // const phone = parsePhoneNumber(phoneNumber);
          // countryCode = phone.country;
        }

        dispatch(
          setCurrentUser({
            uid,
            email,
            phoneNumber,
            countryCode,
          })
        );
      } else {
        dispatch(
          setCurrentUser({
            uid: undefined,
            email: undefined,
            phoneNumber: undefined,
            countryCode: undefined,
            isAdmin: undefined,
          })
        );
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleRedirectResult()
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          setRedirectLoading(false);
        }, 500);
      })
      .catch(() => {
        // error occur;
      });
  }, []);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
  }, [timer]);

  return {
    uid,
    currentUser,
    firebaseUser,
    loading,
    number,
    code,
    check,
    isVerified,
    isReSend,
    isWrongCode,
    isMobile,
    timer,
    redirectLoading,
    setIsReSend,
    setNumber,
    setCode,
    setCheck,
    googleSignIn,
    phoneNumberSignIn,
    verifyPressed,
    reSendCode,
    logOut,
    onEditPhone,
  };
};

export default useLoginHook;
