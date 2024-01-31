import { db, functions } from '@/credentials/firebase';
import { useWindowSize } from '@/hooks/useWindowSize';
import { sendCreditPaymentV2Function } from '@/keys/functionNames';
import { termsChecked1LocalKey, termsChecked2LocalKey } from '@/keys/localStorageKeys';
import { OrderStruct } from '@/props/FirestoreStruct';
import { ServiceTypeEnum } from '@/props/servicesProps';
import { useUserStore } from '@/store/reducers/usersReducer';
import { DialogProps, useMediaQuery } from '@mui/material';
import { httpsCallable } from 'firebase/functions';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { convertDocToConvo, senderSendNewConversation } from '../../Profile/util/helper';
import { doc, getDoc } from 'firebase/firestore';
import { CONVERSATION, chatRoomIdKey } from '@/keys/firestoreKeys';
import { useRouter } from 'next/navigation';
import Dialog from '@/components/molecules/dialogs';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Box from '@/components/atoms/box';
import CheckBox from '@/components/atoms/checkbox';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import { setSelectedConversation } from '@/store/reducers/conversationReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { setIsOpenChatDrawer, useDrawerOpenStore } from '@/store/reducers/drawerOpenReducer';

interface IPaymentConfimationDialog extends DialogProps {
  data: OrderStruct | undefined;
  onCancelHandle: () => void;
}
const PaymentConfimationDialog = ({ data, onCancelHandle, ...props }: IPaymentConfimationDialog) => {
  const [size] = useWindowSize();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isOpenChatDrawer } = useDrawerOpenStore();

  const isF2FMeetup =
    data?.services?.serviceType === ServiceTypeEnum?.meetup || data?.services?.serviceType === ServiceTypeEnum?.sports;
  const termsKey = isF2FMeetup ? termsChecked1LocalKey : termsChecked2LocalKey;

  const { currentUser } = useUserStore();
  const router = useRouter();
  const [myUID, profileImage, nickname] = [
    currentUser?.uid,
    currentUser?.profileImage,
    currentUser?.nickname || currentUser?.nick,
  ];

  // const setSelectedConversation = useSelectedConversation((state) => state.setSelectedConversation);

  const [loading, setLoading] = useState<boolean>(false);
  const [isCheck, setCheck] = useState<boolean>(localStorage.getItem(termsKey) ? true : false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasPaid, setPaid] = useState<boolean>((data?.st as number) === 2);

  useEffect(() => {
    if (errorMessage) {
      alert(JSON.stringify(errorMessage, null, 2));
      // setCenterSnackbar({
      //   open: true,
      //   message: errorMessage,
      // });
    }
  }, [errorMessage]);

  const onCheckedHandled = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      localStorage.setItem(termsKey, 'true');
    } else {
      localStorage.removeItem(termsKey);
    }
    setCheck(checked);
  };

  const sendPayment = async () => {
    if (!data || !data?.services) {
      setErrorMessage('Unexpected error');
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage('DO NOT CLOSE');

    try {
      const functionName = sendCreditPaymentV2Function;
      const sendCreditPayment = httpsCallable(functions, functionName);

      const map: { [key: string]: any } = { id: data.id };

      if (!myUID || !nickname || !profileImage) {
        setLoading(false);
        setErrorMessage('No user data');
        return;
      }
      // const conversationHelper = new Conversation();

      const isClient = data?.cuid === myUID;
      const recipientUid = isClient ? data?.buid : data?.cuid;

      const convo = senderSendNewConversation(
        myUID,
        recipientUid,
        nickname,
        profileImage,
        data?.inf?.[recipientUid]?.nick ?? 'null',
        data?.inf?.[recipientUid]?.u ?? 'null',
        'PAYMENT RECEIVIED'
      );
      map.convo = convo;

      // const clubName = sessionStorage.getItem(club)
      // const clubState = sessionStorage.getItem(state)

      //make sure babe is under this club too
      //because client might view others profiles via url
      // if(clubName && clubState){
      //     map.extra = {club:{
      //         name: clubName,
      //         state: clubState
      //     }}
      // }

      const res = await sendCreditPayment(map);

      const json = res?.data as any;
      const status = json?.status;

      switch (status) {
        case 200: {
          if (data?.pr) {
            try {
              setErrorMessage(
                JSON.stringify(
                  `logEvent(analytics, 'spend_virtual_currency', {
                    value: data.pr / 100,
                    item_name: 'RentBabe virtual currency',
                    virtual_currency_name: 'credit',
                  })`
                )
              );
            } catch (error) {
              console.log('error ===> ', error);
            }
          }
          const chatRoomId = data?.cri || json?.chatRoomId;

          if (!chatRoomId) {
            window?.location?.reload();
            setPaid(true);

            return;
          }

          const docs = await getDoc(doc(db, CONVERSATION, chatRoomId));

          const conversation = convertDocToConvo(docs);

          dispatch(setSelectedConversation({ data: conversation }));

          if (size?.width > 600) {
            dispatch(setIsOpenChatDrawer(!isOpenChatDrawer));
            router?.push('/');
          } else {
            router?.push(`/chatbox?${chatRoomIdKey}=${docs?.id}`);
          }

          setPaid(true);

          break;
        }
        case 201:
          setErrorMessage('Alread paid');
          break;
        case 404:
          setErrorMessage('Does not exist');
          break;
        case 400:
          setErrorMessage('Transaction failed, please try again');
          break;
      }
    } catch (error) {
      setErrorMessage('Unexpected error occur, please try again');
    } finally {
      setLoading(false);
      onCancelHandle();
    }
  };

  return (
    <>
      {' '}
      <Dialog
        sx={{
          '.MuiPaper-root': {
            borderRadius: '24px',
            maxWidth: '448px',
            margin: isMobile ? '16px' : '32px',
          },
          '.MuiDialogContent-root': {
            padding: isMobile ? '24px 16px 16px 16px' : '24px',
          },
          '.MuiDialogActions-root': {
            padding: isMobile ? '16px' : '24px',
          },
        }}
        {...props}
        footer={
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Button variant="outlined" color="primary" disabled={loading} onClick={onCancelHandle}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={sendPayment}
              loading={loading}
              disabled={isCheck ? !data || !data?.pr || hasPaid : true}
            >
              Pay
            </Button>
          </Box>
        }
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Box textAlign="center">
            <PriceLogo size={60} />
          </Box>
          {loading ? (
            <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'} textAlign="center">
              Payment processing
            </Typography>
          ) : (
            <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
              You will be sending {((data?.pr as number) / 100)?.toFixed(2)} Credit to{' '}
              <span
                style={{
                  textTransform: 'capitalize',
                }}
              >
                {data?.inf?.[data?.buid]?.nick}.
              </span>
            </Typography>
          )}

          {loading ? (
            <Typography variant="subtitle1" fontWeight={500} color="#646464)" component={'span'} textAlign="center">
              Please do not refresh the page
            </Typography>
          ) : isF2FMeetup ? (
            <CheckBox
              checked={isCheck}
              size="small"
              onChange={onCheckedHandled}
              color="primary"
              label={
                <Typography variant="body2" color="#646464" component="span">
                  I have read and understand the terms above. By paying, I agree to and accept the terms.
                </Typography>
              }
            />
          ) : (
            <CheckBox
              checked={isCheck}
              size="small"
              onChange={onCheckedHandled}
              color="primary"
              label={
                <Typography variant="body2" color="#646464" component="span">
                  I understand that I only have 72 hours to request for a refund from the date of purchase. I am advice
                  to make payment in 1-2 days in advance.
                </Typography>
              }
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default PaymentConfimationDialog;
