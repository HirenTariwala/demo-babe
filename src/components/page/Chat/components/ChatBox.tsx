import { useWindowSize } from '@/hooks/useWindowSize';
import {
  // setConversation,
  setSelectedConversation,
  useSelectedConversationStore,
} from '@/store/reducers/conversationReducer';
import {
  // setCurrentUser,
  useUserStore,
} from '@/store/reducers/usersReducer';
import React, { useEffect, useState } from 'react';
import { convertDocToConvo, getRecipientUID } from '../../Profile/util/helper';
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useGetUserData } from '@/hooks/useGetUserData';
import { db } from '@/credentials/firebase';
import {
  CONVERSATION,
  infoKey,
  lastSeenKey,
  mobileUrlKey,
  nicknameKey,
  privacyTimeStampKey,
  recipientLastSeenKey,
  senderLastSeenKey,
  // teleIdKey,
  timeStampKey,
} from '@/keys/firestoreKeys';
import { useAppDispatch } from '@/store/useReduxHook';
import { Helper } from '@/utility/helper';
import { useRouter } from 'next/navigation';
import Box from '@/components/atoms/box';
import ChatHeader from './ChatHeader';
import Alert from '@/components/atoms/alert';
import Typography from '@/components/atoms/typography';
import ChatView from './ChatView';
import { useMediaQuery } from '@mui/material';
import styles from '../chat.module.css';
import { setIsOpenProfileModal } from '@/store/reducers/drawerOpenReducer';
import { lockChat } from '@/utility/CloudFunctionTrigger';
import LockUnlockChatDialog from './Dialog/LockUnlockChatDialog';
import UnVerifiedModal from '../../Wallet/components/Withdrawn/UnVerifiedModal';
import Toast from '@/components/molecules/toast';

interface IChatBox {
  loading?: boolean;
}

const ChatBox = ({ loading }: IChatBox) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const maxWidth = 1000;
  // const isChatBox = window.location.href.getQueryStringValue('cri') ? true : false;
  const isChatBox = false;
  const { currentUser } = useUserStore();
  const [uid, isVerified, rejectedReasonAfter] = [
    currentUser?.uid,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
  ];
  const selectedConversation = useSelectedConversationStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const users = Object.keys(selectedConversation?.info ?? {});

  const chatUUID = selectedConversation?.id;

  const [size] = useWindowSize();
  const otherUserId = getRecipientUID(currentUser?.uid, selectedConversation);
  const [otherUid, setOtherUid] = useState<string | undefined>(otherUserId);

  const [online, setOnline] = useState<Timestamp | undefined>(undefined);
  const { loading: isUserDataLoading, data: userData } = useGetUserData(otherUid);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [openAlert, setAlert] = useState<boolean>(true);
  const [apiRevalidate, setApiRevalidate] = useState<number>(0);

  const [isOpenLockUnlockChat, setIsOpenLockUnlockChat] = useState<boolean>(false);
  const [lockUnlockChatLoading, setLockUnlockChatLoading] = useState<boolean>(false);

  const [isOpenUnVerifiedModal, setIsOpenUnVerifiedModal] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const onCloseToast = () => {
    setOpenToast(false);
  };
  const onOpenToastWithMsg = (msg: string) => {
    setToastMsg(msg);
    setOpenToast(true);
  };

  useEffect(() => {
    if (!selectedConversation && chatUUID) {
      getDoc(doc(db, CONVERSATION, chatUUID)).then((snapshot) => {
        const map = convertDocToConvo(snapshot);

        dispatch(setSelectedConversation({ data: map }));
      });
    }

    setAlert(true);
    // eslint-disable-next-line
  }, [selectedConversation, chatUUID, apiRevalidate]);

  useEffect(() => {
    if (chatUUID) {
      getDoc(doc(db, CONVERSATION, chatUUID)).then((snapshot) => {
        const map = convertDocToConvo(snapshot);

        dispatch(setSelectedConversation({ data: map }));
      });
    }
  }, [apiRevalidate]);

  useEffect(() => {
    const value = getRecipientUID(currentUser?.uid, selectedConversation);
    setOtherUid(value);

    // eslint-disable-next-line
  }, [selectedConversation]);

  useEffect(() => {
    return () => {
      if (Helper?.getURLEnd().toLowerCase() === 'chat') {
        dispatch(setSelectedConversation({ data: undefined }));
      }

      if (!uid || !selectedConversation) return;

      const isMine = currentUser?.uid === (selectedConversation?.sender as string);

      const key = `${infoKey}.${uid}.${lastSeenKey}`;

      const now = Timestamp?.now();

      updateDoc(doc(db, CONVERSATION, selectedConversation?.id), {
        [isMine ? senderLastSeenKey : recipientLastSeenKey]: now,
        [key]: now,
      });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const cache = selectedConversation;

    if (!userData || !cache) {
      return;
    }

    const isCurrent = cache?.users?.includes(userData?.id);
    // const item = helper.convertToItem(userData);
    // const item = userData?.data();

    // if (item) dispatch(setConversation({item}));

    if (isCurrent) {
      const otherUserUUID = userData?.id;
      // const teleId = userData?.get(teleIdKey) as string;
      const url = userData?.get(mobileUrlKey) as string;
      const username = userData?.get(nicknameKey) as string;

      const otherUserImage = cache?.info?.[otherUserUUID].mbl;
      const otherUsername = cache?.info?.[otherUserUUID].nick;

      const map: {
        [key: string]: any;
      } = {};

      if (url && otherUserImage && otherUserImage !== url) {
        map[`${infoKey}.${otherUid}.${mobileUrlKey}`] = url;
      }

      if (username && otherUsername && otherUsername !== username) {
        map[`${infoKey}.${otherUid}.${nicknameKey}`] = username;
      }

      if (Object.keys(map).length > 0) {
        updateDoc(doc(db, CONVERSATION, cache?.id), map);
      }

      const timeStamp = (userData?.get(timeStampKey) as Timestamp) ?? (userData?.get(privacyTimeStampKey) as Timestamp);
      if (timeStamp) {
        setOnline(timeStamp);
      }

      // if (cache?.info && otherUserUUID && Object.keys(cache.info).includes(otherUserUUID)) {
      //   cache.info = {
      //     ...cache?.info,
      //     [otherUserUUID!]: { ...cache?.info?.[otherUserUUID!], ...{ [mobileUrlKey]: url } },
      //   };
      //   if (teleId) {
      //     cache.info = {
      //       ...cache?.info,
      //       [otherUserUUID!]: { ...cache.info?.[otherUserUUID!], ...{ [teleIdKey]: teleId } },
      //     };
      //   }
      // }
      dispatch(setSelectedConversation({ data: cache }));
    }
  }, [userData, selectedConversation]); // eslint-disable-line react-hooks/exhaustive-deps

  const profileClick = () => {
    dispatch(setIsOpenProfileModal(true));
  };

  const onCloseAlert = () => {
    setAlert(false);
  };

  const revalidate = () => {
    setApiRevalidate((prev) => prev + 1);
  };

  const onLockChat = async () => {
    if (!chatUUID) return;
    if (!isVerified) {
      // TODO:
      // setIsOpenUnVerifiedModal(true);
      // return;
    }
    if (selectedConversation?.hasOrder || false) {
      setLockUnlockChatLoading(true);
      try {
        await lockChat(chatUUID);
        // Successfully locked the chat
      } catch (error) {
        console.log('chat Lock-Unlock Error==> ', error);
        // error occur;
      } finally {
        revalidate();
        setLockUnlockChatLoading(false);
      }
    } else {
      setIsOpenLockUnlockChat(true);
    }
  };
  const handlerCloseLockUnlockChat = () => {
    setIsOpenLockUnlockChat(false);
  };
  const openUnVerifiedModalHandler = () => {
    setIsOpenUnVerifiedModal(true);
  };

  return (
    <Box
      bgcolor="white"
      width="100%"
      height="100%"
      minWidth={isMobile ? '100%' : '630px'}
      onClick={onCloseAlert}
    >
      <Toast alertMessage={toastMsg} onClose={onCloseToast} open={openToast} />
      <Box
        bgcolor="white"
        maxWidth={isChatBox ? maxWidth : 'auto'}
        height="100%"
        position="relative"
        className={styles.chatView}
      >
        <ChatHeader
          senderUUID={selectedConversation?.sender}
          myBlock={selectedConversation?.block?.includes(currentUser?.uid ?? '-') ?? false}
          chatRoomID={chatUUID}
          isUserDataLoading={isUserDataLoading}
          userData={userData}
          openBackButton={size?.width <= 600}
          online={online}
          profileClick={profileClick}
          hasOrder={selectedConversation?.hasOrder || false}
          revalidate={revalidate}
          onLockChat={onLockChat}
          lockUnlockChatLoading={lockUnlockChatLoading}
        />

        {openAlert && (
          <Alert onClose={onCloseAlert} className={styles.alertMsg} severity="warning">
            <Typography
              variant="caption"
              color="inherit"
              dangerouslySetInnerHTML={{
                __html: `Our on-platform transaction by using Credits protects your <b>personal information</b> and prevent you from getting <b>scam</b>. We <b>BAN</b> users who exchange contacts before payment is made.`,
              }}
            />
          </Alert>
        )}

        {loading ? (
          <>
            basic Card
            {/* <BasicCard /> */}
          </>
        ) : !selectedConversation ? (
          // <BasicCard />
          'basis Card'
        ) : (
          <ChatView
            myBlock={selectedConversation?.block?.includes(currentUser?.uid ?? '-') ?? false}
            otherBlock={selectedConversation?.block?.includes(otherUid ?? '-') ?? false}
            requestNewOrder={profileClick}
            onFocus={() => setAlert(false)}
            onLockChat={onLockChat}
            lockUnlockChatLoading={lockUnlockChatLoading}
            openUnVerifiedModalHandler={openUnVerifiedModalHandler}
          />
        )}
      </Box>
      {chatUUID && (
        <LockUnlockChatDialog
          chatRoomID={chatUUID}
          isOpen={isOpenLockUnlockChat}
          onCloseHandler={handlerCloseLockUnlockChat}
          revalidate={revalidate}
        />
      )}
      {isOpenUnVerifiedModal && (
        <UnVerifiedModal
          onOpenToastWithMsg={onOpenToastWithMsg}
          open={isOpenUnVerifiedModal}
          onClose={() => setIsOpenUnVerifiedModal(false)}
          myUID={uid}
          verified={isVerified}
          rejectedReasonAfter={rejectedReasonAfter}
        />
      )}
    </Box>
  );
};

export default ChatBox;
