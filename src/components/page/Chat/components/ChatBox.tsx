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

interface IChatBox {
  loading?: boolean;
}

const ChatBox = ({ loading }: IChatBox) => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const maxWidth = 1000;
  // const isChatBox = window.location.href.getQueryStringValue('cri') ? true : false;
  const isChatBox = false;
  const { currentUser } = useUserStore();
  const [uid] = [currentUser?.uid];
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
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [openAlert, setAlert] = useState<boolean>(true);
  const [apiRevalidate, setApiRevalidate] = useState<number>(0);

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

  // const closeModal = () => {
  //   setShowProfile(false);
  // };

  const profileClick = () => {
    // if (size?.width < widthToOpenModal) {
    //   // data
    //   const item = userData?.data();
    //   router.push(`/page/Profile?uid=${userData?.id}&private=false`, { ...item, extras: selectedConversation });
    //   // history.push(`/page/Profile?uid=${data?.id}`)
    // } else {
    //   setShowProfile(true);
    // }
    setShowProfile(true);
  };

  const onCloseAlert = () => {
    setAlert(false);
  };

  // if (!selectedConversation || !users.includes(uid || '')) {
  //   return (
  //     <Box width={'100%'} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
  //       <LoadingIcon />
  //     </Box>
  //   );
  // } else {
  //   return <Box>hello</Box>;
  // }

  const revalidate = () => {
    setApiRevalidate((prev) => prev + 1);
  };

  return (
    <Box
      // display="flex"
      // justifyContent="center"
      // alignItems="center"
      bgcolor="white"
      width="100%"
      height="100%"
      onClick={onCloseAlert}
    >
      <Box bgcolor="white" maxWidth={isChatBox ? maxWidth : 'auto'} height="100%">
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
        />

        {openAlert && (
          <Alert
            onClose={onCloseAlert}
            style={{
              width: '100%',
              position: 'absolute',
              top: '77px',
              zIndex: 1,
              maxWidth: '620px',
            }}
            severity="warning"
          >
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
            //isDisabled={selectedConversation.hasOrder ? false : currentUser?.isAdmin ? false : true }
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatBox;
