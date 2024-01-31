'use client';
import { db } from '@/credentials/firebase';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import {
  CONVERSATION,
  CREDIT,
  MESSAGES,
  ORDER,
  balanceKey,
  chatRoomIdKey,
  messageIdKey,
  timeStampKey,
} from '@/keys/firestoreKeys';
import { OrderStruct } from '@/props/FirestoreStruct';
import { useUserStore } from '@/store/reducers/usersReducer';
import { Helper } from '@/utility/helper';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { convertDocToConvo } from '../Profile/util/helper';
import { setSelectedConversation } from '@/store/reducers/conversationReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { useMediaQuery } from '@mui/material';
import { setIsOpenChatDrawer, useDrawerOpenStore } from '@/store/reducers/drawerOpenReducer';

const useCheckoutHook = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isOpenChatDrawer } = useDrawerOpenStore();
  const orderId = Helper?.getQueryStringValue('id');
  const [hasExpired, setExpired] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const { currentUser } = useUserStore();
  const [totalBalance, setTotalBalance] = useState(0);
  const [isOpenPayConfirmation, setIsOpenPayConfirmation] = useState<boolean>(false);
  const uid = currentUser?.uid;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading: creditLoading, data: creditData } = useDocumentQuery(
    `${uid}-balance`,
    doc(db, CREDIT, uid ?? 'empty')
  );

  if (creditData?.exists() && !totalBalance) {
    if (creditData?.get(balanceKey) as number) setTotalBalance(creditData?.get(balanceKey) as number);
  }
  const { data: orderData, loading } = useDocumentQuery(
    `order-data-${orderId}`,
    orderId ? doc(db, ORDER, orderId) : undefined
  );
  const cri = orderData?.get(chatRoomIdKey);
  const mid = orderData?.get(messageIdKey);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: messageData, loading: msgLoading } = useDocumentQuery(
    cri && mid ? `order-data-${orderId}` : '',
    cri && mid ? doc(db, CONVERSATION, cri, MESSAGES, mid) : undefined
  );

  useEffect(() => {
    if (hasExpired) setIsOpenPayConfirmation(false);
  }, [hasExpired]);

  if (orderData?.exists && !hasExpired) {
    const today = new Date();
    const timeStamp = orderData?.get(timeStampKey) as Timestamp;
    const diffMs = today?.getTime() - timeStamp?.toDate()?.getTime();
    const diffMins = Math?.round(diffMs / 60000);
    if (diffMins > Helper?.minutesToExpire()) {
      setExpired(true);
    }
  }
  const data = orderData?.data() as OrderStruct | undefined;
  const msgData = messageData?.data();

  const content = msgData?.ctn?.split('\n');

  const totalAmount = content
    ? parseFloat(content?.at(-1)?.split(': ')[1]?.trim()?.split(' Credit')[0])?.toFixed(2)
    : '0.00';

  let newTimeFormat = '';
  const singleServicePrice = data?.services?.details?.price
    ? (data?.services?.details?.price / 100)?.toFixed(2)
    : '0.00';
  const cabFare = content ? parseFloat(content?.[5]?.split('+')[1]?.split(' Credits')[0])?.toFixed(2) : '0.00';

  const totalServicePrice = (parseFloat(totalAmount) - parseFloat(cabFare))?.toFixed(2) ?? '0.00';

  if (content) {
    const servicesSuffix = data?.services?.details?.suffix;
    const unit = parseFloat(totalServicePrice) / parseFloat(singleServicePrice);

    if (servicesSuffix === 1) {
      newTimeFormat = `${unit}Hr`;
    } else if (servicesSuffix === 0) {
      newTimeFormat = `${unit * 15}Min`;
    } else {
      newTimeFormat = `${unit}Game`;
    }
  }

  const onClosePayConfirmationHandle = () => {
    setIsOpenPayConfirmation(false);
  };
  const chatOnClick = async () => {
    const chatRoomId = data?.cri;
    if (!chatRoomId) return;

    setChatLoading(true);

    // const convoHelper = new Conversation();

    const docs = await getDoc(doc(db, CONVERSATION, chatRoomId));

    const conversation = convertDocToConvo(docs);

    dispatch(setSelectedConversation({ data: conversation }));

    if (!isMobile) {
      dispatch(setIsOpenChatDrawer(!isOpenChatDrawer));
      // router?.push('/');
    } else {
      router?.push(`/chatbox?${chatRoomIdKey}=${docs?.id}`);
    }

    setChatLoading(false);
  };

  return {
    isMobile,
    router,
    loading,
    hasExpired,
    data,
    content,
    newTimeFormat,
    totalServicePrice,
    cabFare,
    totalAmount,
    totalBalance,
    isOpenPayConfirmation,
    chatLoading,
    setExpired,
    setIsOpenPayConfirmation,
    onClosePayConfirmationHandle,
    chatOnClick,
  };
};

export default useCheckoutHook;
