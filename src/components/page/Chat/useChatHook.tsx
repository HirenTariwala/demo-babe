import { useUserStore } from '@/store/reducers/usersReducer';
import {
  Timestamp,
  collection,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  doc as firebaseDoc,
  writeBatch,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/credentials/firebase';
import {
  CONVERSATION,
  // MESSAGES,
  chatRoomIdKey,
  clubKey,
  // createdAtKey,
  deleteOnKey,
  infoKey,
  lastSeenKey,
  pushKey,
  recipientLastSeenKey,
  senderKey,
  senderLastSeenKey,
  stateKey,
  updatedAtKey,
  usersKey,
} from '@/keys/firestoreKeys';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
  setConversation,
  setSelectedConversation,
  useConversationStore,
  useSelectedConversationStore,
} from '@/store/reducers/conversationReducer';
import { ConversationInfo, User } from './shared/types';
import { ListChildComponentProps } from 'react-window';
import { convertDocToConvo, getRecipientUID } from '../Profile/util/helper';
import { useAppDispatch } from '@/store/useReduxHook';
import SkeletonItem from './components/SideBar/SkeletonItem';
import SideBarItem from './components/SideBar/SideBarItem';
import Box from '@/components/atoms/box';
import { useGetUserData } from '@/hooks/useGetUserData';
import { useEffectCollectionQuery } from './hook/useEffectCollectionQuery';
import dayjs from 'dayjs';
import Badge from '@/components/atoms/badge';
import { notifyLocalKey } from '@/keys/localStorageKeys';
import { Helper } from '@/utility/helper';

const useChatHook = () => {
  const dispatch = useAppDispatch();
  const clubName = sessionStorage.getItem(clubKey);
  const clubState = sessionStorage.getItem(stateKey);
  const headerSize = clubName && clubState ? 44 : 0;

  const { currentUser } = useUserStore();
  const { currentConvo } = useConversationStore();
  const { notification: badgeNotification } = currentConvo;
  const [size] = useWindowSize();
  const conversation = useSelectedConversationStore();
  const searchParams = useSearchParams();
  const selectedConversation = useSelectedConversationStore();
  // const chatUUID = selectedConversation?.id ?? window?.location?.href?.getQueryStringValue('cri');
  const chatUUID = selectedConversation?.id;
  const otherUserId = getRecipientUID(currentUser?.uid, selectedConversation);
  const [otherUid, setOtherUid] = useState<string | undefined>(otherUserId);

  const { loading: isUserDataLoading, data: userData } = useGetUserData(otherUid);

  const chatRoomID = searchParams?.get(chatRoomIdKey);

  const defaultSize = Math.ceil(window.innerHeight / 50);

  const [limitCount, setLimitCount] = useState<number>(defaultSize);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limitCount2, setLimitCount2] = useState<number>(defaultSize); //(defaultSize)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [heightIncrease, setHeightIncrease] = useState<number>(0);

  const [uid, isVerified, rejectedReasonAfter, userRBAC] = [
    currentUser?.uid,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
    currentUser?.userRBAC,
  ];

  const {
    loading: loadingChat,
    error: errorChat,
    data: dataConversation,
    hasNextPage: dataHasNextPage,
  } = useEffectCollectionQuery(
    `${uid}-chat`,
    query(
      collection(db, CONVERSATION),
      where(usersKey, 'array-contains', uid),
      orderBy(updatedAtKey, 'desc'),
      limit(limitCount)
    ),
    limitCount
  );

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: errorArchive,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading: loadingArchive,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: dataArchive,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasNextPage: hasNextPageArchive,
  } = useEffectCollectionQuery(
    `${uid}-del`,
    query(collection(db, CONVERSATION), orderBy(`${infoKey}.${uid}.${deleteOnKey}`, 'desc'), limit(limitCount2)),
    limitCount2
  );

  useEffect(() => {
    const value = getRecipientUID(currentUser?.uid, selectedConversation);
    setOtherUid(value);
    // eslint-disable-next-line
  }, [selectedConversation]);

  useEffect(() => {
    const docs = dataConversation?.docs ?? [];

    let playSound = false;
    const promises = [];

    for (let index = 0; index < docs.length; index++) {
      const doc = docs[index];

      const info = doc?.get(infoKey) as User | undefined;
      const isUpdatedAt = doc?.get(updatedAtKey) as Timestamp;
      if (!info || !uid || !isUpdatedAt) {
        continue;
      }

      const isSender = (doc.get(senderKey) as string) === uid;

      const myLastSeen =
        info?.[uid]?.[pushKey] ?? (doc.get(isSender ? senderLastSeenKey : recipientLastSeenKey) as Timestamp);

      const hasMessage = !myLastSeen ? true : myLastSeen < isUpdatedAt ? true : false;

      if (hasMessage) {
        playSound = true;

        promises.push(
          updateDoc(firebaseDoc(db, CONVERSATION, doc?.id), {
            // [`${info}.${uid}.${pushKey}`]: Timestamp.fromDate(isUpdatedAt?.toDate()?.addSeconds(0.5)),
            [`${infoKey}.${uid}.${pushKey}`]: Timestamp.fromDate(
              dayjs(isUpdatedAt?.toDate())?.add(0.5, 'second')?.toDate()
            ),
          })
        );
      }
    }

    if (playSound) {
      // console.log(`play sound for: ${_uid}`)
      // playSoundEffect(incomingMessageSound);
    }

    if (promises.length > 0) {
      Promise.all(promises);
    }

    // eslint-disable-next-line
  }, [dataConversation]);
  useEffect(() => {
    let notification = 0;

    if (!dataConversation) return;

    for (let index = 0; index < dataConversation?.docs?.length; index++) {
      const doc = dataConversation?.docs[index];

      const isSender = (doc?.get(senderKey) as string) === uid;
      const isUpdatedAt = doc?.get(updatedAtKey) as Timestamp;
      const users = doc?.get(infoKey) as User | undefined;

      if (!uid) continue;

      const myLastSeen =
        users?.[uid]?.[lastSeenKey] ?? (doc?.get(isSender ? senderLastSeenKey : recipientLastSeenKey) as Timestamp);

      if (doc?.id === selectedConversation?.id) {
        const map = convertDocToConvo(doc);
        setSelectedConversation({ data: map });

        continue;
      }

      if (!myLastSeen || myLastSeen < isUpdatedAt) {
        notification += 1;
      }
    }

    localStorage.setItem(notifyLocalKey, `${notification}`);

    dispatch(setConversation({ notification: notification, data: dataConversation }));
  }, [dataConversation]);

  const loadNextPage = () => {
    if (dataHasNextPage) {
      setLimitCount(
        (prev) => prev + 10 // calculateChats()  //10
      );
    }
  };

  const calculateSideBarWidth = () => {
    return size?.width > 600 ? '350px' : '100vw';
  };

  const setLastSeen = (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
    const conversation = convertDocToConvo(doc);

    const isMine = uid === (doc?.get(senderKey) as string);

    const key = `${infoKey}.${uid}.${lastSeenKey}`;

    const now = Timestamp.now(); // serverTimestamp()

    const batch = writeBatch(db);

    if (conversation?.id) {
      const nowRef = firebaseDoc(db, CONVERSATION, conversation.id);

      batch.update(nowRef, { [isMine ? senderLastSeenKey : recipientLastSeenKey]: now, [key]: now });
    }

    if (selectedConversation?.id) {
      const prevRef = firebaseDoc(db, CONVERSATION, selectedConversation.id);
      batch.update(prevRef, { [isMine ? senderLastSeenKey : recipientLastSeenKey]: now, [key]: now });
    }

    batch?.commit();
  };
  const onClickConversation = (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
    if (selectedConversation?.id === doc?.id) return;

    const conversation = convertDocToConvo(doc);

    if (!conversation) return;

    setLastSeen(doc);
    openChat(conversation);
  };
  const openChat = (conversation: ConversationInfo) => {
    if (size?.width <= 600) {
      dispatch(setSelectedConversation({ data: conversation }));
      // push chat box
      // history.push(`./chatbox?${chat_room_id}=${conversation.id}`, conversation)
    } else {
      dispatch(setSelectedConversation({ data: conversation }));
    }
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const doc = dataConversation?.docs[index];

    if (!doc) return <SkeletonItem style={style} index={index} />;

    const isSender = (doc?.get(senderKey) as string) === uid;
    const user = doc?.get(infoKey) as User;
    const isUpdatedAt = doc?.get(updatedAtKey) as Timestamp;

    const myLastSeen =
      user?.[uid!]?.[lastSeenKey] ?? (doc?.get(isSender ? senderLastSeenKey : recipientLastSeenKey) as Timestamp);

    const badge = !myLastSeen ? ' ' : myLastSeen < isUpdatedAt ? ' ' : 0;

    return (
      <Box key={index} style={{ ...style, marginTop: `${index * 8}px` }}>
        <SideBarItem
          uid={uid!}
          otherUid={getRecipientUID(uid, convertDocToConvo(doc))}
          isSelected={selectedConversation?.id === doc?.id}
          badge={badge}
          doc={doc}
          time={dayjs(Helper?.timeStempToDate(isUpdatedAt))?.format('hh:mm A')}
          index={index}
          onClick={() => onClickConversation(doc)}
        />
      </Box>
    );
  };

  const tabsData = [
    {
      lable: (value: number) => (
        <span
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <span>Conversations</span>

          {badgeNotification?.toString() != '0' && (
            <span>
              <Badge
                badgeContent={badgeNotification}
                sx={{
                  '.MuiBadge-badge': {
                    color: value === 0 ? '#fff' : '',
                    background: value === 0 ? '#E32D2D' : '#F0F0F0',
                  },
                }}
              />
            </span>
          )}
        </span>
      ),
      content: '',
    },
    {
      lable: (value: number) => (
        <span
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <span>Archived chats</span>
          <span>
            <Badge
              badgeContent={0}
              sx={{
                '.MuiBadge-badge': {
                  color: value === 1 ? '#fff' : '',
                  background: value === 1 ? '#E32D2D' : '#F0F0F0',
                },
              }}
            />
          </span>
        </span>
      ),
      content: '',
    },
  ];

  return {
    tabsData,
    loadingChat,
    errorChat,
    dataConversation,
    size,
    headerSize,
    dataHasNextPage,
    uid,
    isVerified,
    rejectedReasonAfter,
    userRBAC,
    conversation,
    chatRoomID,
    heightIncrease,
    loadNextPage,
    calculateSideBarWidth,
    Row,
    selectedConversation,
    currentUser,
    chatUUID,
    isUserDataLoading,
    userData,
  };
};

export default useChatHook;
