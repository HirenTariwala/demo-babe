import { useUserStore } from '@/store/reducers/usersReducer';
import { useCollectionQuery } from './hook/useCollectionQuery';
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
import { setSelectedConversation, useSelectedConversationStore } from '@/store/reducers/conversationReducer';
import { ConversationInfo, User } from './shared/types';
import { ListChildComponentProps } from 'react-window';
import { convertDocToConvo, getRecipientUID } from '../Profile/util/helper';
import { useAppDispatch } from '@/store/useReduxHook';
import SkeletonItem from './components/SideBar/SkeletonItem';
import SideBarItem from './components/SideBar/SideBarItem';
import Box from '@/components/atoms/box';
import { useGetUserData } from '@/hooks/useGetUserData';

const useChatHook = () => {
  const dispatch = useAppDispatch();
  const clubName = sessionStorage.getItem(clubKey);
  const clubState = sessionStorage.getItem(stateKey);
  const headerSize = clubName && clubState ? 44 : 0;

  const { currentUser } = useUserStore();
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
  } = useCollectionQuery(
    uid ? `${uid}-chat` : undefined,
    uid
      ? query(
          collection(db, CONVERSATION),
          where(usersKey, 'array-contains', uid ?? 'empty'),
          orderBy(updatedAtKey, 'desc'),
          limit(limitCount)
        )
      : undefined,
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
  } = useCollectionQuery(
    uid ? `${uid}-del` : undefined,
    uid
      ? query(collection(db, CONVERSATION), orderBy(`${infoKey}.${uid}.${deleteOnKey}`, 'desc'), limit(limitCount2))
      : undefined,
    limitCount2
  );

  useEffect(() => {
    const value = getRecipientUID(currentUser?.uid, selectedConversation);
    setOtherUid(value);
    // eslint-disable-next-line
  }, [selectedConversation]);

  useEffect(() => {
    const docs = dataConversation ?? [];

    let playSound = false;
    const promises = [];

    for (let index = 0; index < docs.length; index++) {
      const doc = docs[index];

      const info = doc.get(infoKey) as User | undefined;
      const isUpdatedAt = doc.get(updatedAtKey) as Timestamp | undefined;
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
            [`${info}.${uid}.${pushKey}`]: Timestamp.fromDate(isUpdatedAt?.toDate()),
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

  const loadNextPage = () => {
    if (dataHasNextPage) {
      setLimitCount(
        (prev) => prev + 10 // calculateChats()  //10
      );
    }
  };

  const tabsData = [
    {
      lable: () => 'Conversations',
      content: '',
      badge: 2,
    },
    {
      lable: () => 'Archived chats',
      content: '',
      badge: 2,
    },
  ];
  const calculateSideBarWidth = () => {
    return size?.width > 600 ? '350px' : '100vw';
  };
  
  const setLastSeen = (doc: any) => {
    const conversation = convertDocToConvo(doc);

    const isMine = uid === (doc.get(senderKey) as string);

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

    batch.commit();
  };
  const onClickConversation = (doc: any) => {
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
    const doc = dataConversation ? dataConversation[index] : '';

    if (!doc) return <SkeletonItem style={style} index={index} />;

    return (
      <Box key={index} style={{ ...style, marginTop: `${index * 8}px` }}>
        <SideBarItem
          uid={uid!}
          otherUid={getRecipientUID(uid, convertDocToConvo(doc))}
          isSelected={selectedConversation?.id === doc.id ? true : true}
          doc={doc}
          index={index}
          onClick={() => onClickConversation(doc)}
        />
      </Box>
    );
  };
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
