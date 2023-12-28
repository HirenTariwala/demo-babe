'use client';
import { useUserStore } from '@/store/reducers/usersReducer';
// import { useState } from 'react';
import styles from './page.module.css';
// import Button from '@/components/atoms/button';
// import Typography from '@/components/atoms/typography';
// import Rating from '@/components/molecules/ratings';
// import Box from '@/components/atoms/box';
// import PriceLogo from '@/components/atoms/icons/price-logo';
// import Header from '@/components/organisms/header';
import { useAppDispatch } from '@/store/useReduxHook';
import { useEffect } from 'react';
import fetchUserData from '@/store/thunks/fetchUser';
import Rent from '@/components/page/Rent';

export default function Home() {
  const dispatch = useAppDispatch();
  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  // const firebaseUser = useFirebaseUser();

  const [uid] = [currentUser?.uid];
  useEffect(() => {
    if (uid) {
      dispatch(fetchUserData(uid));
    }
  }, [uid, dispatch]);

  // const receviedData = () => {
  //   const [isShow, setIsShow] = useState(false);
  //   const [value, setValue] = useState<number | null>(0);
  //   const handleClick = () => {
  //     setIsShow(!isShow);
  //   };
  //   return (
  //     <>
  //       <Box paddingTop={3} paddingBottom={4}>
  //         {isShow && (
  //           <Rating
  //             ratingData={undefined}
  //             max={5}
  //             value={value}
  //             onChange={(event, newValue) => {
  //               setValue(newValue);
  //             }}
  //           />
  //         )}
  //         <Box display="flex" alignItems="center" flexDirection={isShow ? 'row' : 'column'} gap={3}>
  //           {!isShow && (
  //             <Typography variant="caption" color={'#999999'} component="span">
  //               You have received <PriceLogo size={16} />
  //               <Typography variant="caption" color={'#1A1A1A'} fontWeight={500} component="span">
  //                 {1.11}
  //               </Typography>{' '}
  //               from
  //               <Typography variant="caption" color={'#1A1A1A'} fontWeight={500} component="span">
  //                 {' mscott'}
  //               </Typography>
  //             </Typography>
  //           )}
  //           <Button
  //             variant="outlined"
  //             onClick={handleClick}
  //             sx={{ fontSize: 14, width: 'fit-content', p: '8px 16px' }}
  //             startIcon={
  //               <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
  //                 <path
  //                   d="M8.02181 2.3022C8.17547 1.99091 8.25229 1.83526 8.35659 1.78553C8.44734 1.74227 8.55277 1.74227 8.64351 1.78553C8.74781 1.83526 8.82464 1.99091 8.9783 2.3022L10.4361 5.25551C10.4814 5.34741 10.5041 5.39336 10.5373 5.42904C10.5666 5.46063 10.6018 5.48622 10.6409 5.5044C10.6851 5.52494 10.7358 5.53235 10.8372 5.54717L14.098 6.02379C14.4414 6.07398 14.6131 6.09908 14.6926 6.18295C14.7617 6.25592 14.7942 6.35619 14.781 6.45584C14.7659 6.57038 14.6416 6.69144 14.393 6.93358L12.0343 9.23094C11.9608 9.30255 11.924 9.33836 11.9003 9.38096C11.8793 9.41869 11.8658 9.46013 11.8607 9.50299C11.8548 9.5514 11.8635 9.60199 11.8808 9.70315L12.4373 12.9481C12.496 13.2903 12.5254 13.4614 12.4702 13.563C12.4222 13.6513 12.3369 13.7133 12.2381 13.7316C12.1245 13.7527 11.9708 13.6719 11.6634 13.5103L8.74829 11.9772C8.65746 11.9294 8.61205 11.9056 8.5642 11.8962C8.52184 11.8879 8.47827 11.8879 8.4359 11.8962C8.38806 11.9056 8.34264 11.9294 8.25181 11.9772L5.33666 13.5103C5.02932 13.6719 4.87565 13.7527 4.76202 13.7316C4.66316 13.7133 4.57786 13.6513 4.52987 13.563C4.47471 13.4614 4.50406 13.2903 4.56276 12.9481L5.1193 9.70315C5.13665 9.60199 5.14532 9.5514 5.13945 9.50299C5.13426 9.46013 5.12078 9.41869 5.09978 9.38096C5.07606 9.33836 5.03929 9.30255 4.96576 9.23094L2.60708 6.93358C2.35848 6.69144 2.23418 6.57038 2.21906 6.45584C2.2059 6.35619 2.23841 6.25592 2.30754 6.18295C2.387 6.09908 2.55869 6.07398 2.90207 6.02379L6.16291 5.54717C6.26432 5.53235 6.31503 5.52494 6.35919 5.5044C6.39828 5.48622 6.43348 5.46063 6.46283 5.42904C6.49598 5.39336 6.51866 5.34741 6.56402 5.25551L8.02181 2.3022Z"
  //                   stroke="black"
  //                   strokeWidth="1.5"
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                 />
  //               </svg>
  //             }
  //           >
  //             {isShow ? 'Update review' : 'Review'}
  //           </Button>
  //           <Button onClick={handleClick} variant="text" sx={{ fontSize: 14, width: 'fit-content', p: '8px 16px' }}>
  //             Rate RentBabe
  //           </Button>
  //         </Box>
  //       </Box>
  //     </>
  //   );
  // };

  return (
    <main className={styles.main}>
      <Rent />
    </main>
  );
}
