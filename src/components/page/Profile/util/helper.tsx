import Box from '@/components/atoms/box';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import Typography from '@/components/atoms/typography';
import { meetupEnum } from '@/enum/myEnum';
import {
  blockKey,
  hasOrderKey,
  infoKey,
  lastMessageKey,
  mobileUrlKey,
  nicknameKey,
  orderKey,
  orderTimeKey,
  recipientLastSeenKey,
  recipientNicknameKey,
  recipientProfileURLKey,
  senderKey,
  senderLastSeenKey,
  senderNicknameKey,
  senderProfileURLKey,
  updatedAtKey,
  usersKey,
} from '@/keys/firestoreKeys';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { ConversationInfo, User } from '../../Chat/shared/types';

const CabFareComp = (icon: any, text: string) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Typography fontWeight={500}>{text}</Typography>
    </Box>
  );
};

export const getCabFarePrice = (cabfare: any) => {
  switch (cabfare) {
    case 0:
      return 0;
    case 10:
      return 1000;
    case 20:
      return 2000;
    case 30:
      return 3000;
    case 40:
      return 4000;
    case 50:
      return 5000;
    case 60:
      return 6000;
    default:
      return 0;
  }
};

export const serviceCheck = (imageUrl: string | undefined) => {
  const parts = imageUrl?.split('/SERVICES/');
  if (parts && parts?.length > 1) {
    const extractedString = parts?.[1].split('/')[0];
    return ['EMEET', 'GAMES'].includes(extractedString);
  }
};

export const getRestrictions = (meetupType: meetupEnum | undefined | string): string[] => {
  switch (meetupType) {
    case meetupEnum.meals:
      return ['cafe', 'restaurant', 'bakery', 'bar', 'shopping_mall'];

    case meetupEnum.dining:
      return ['cafe', 'restaurant', 'shopping_mall'];

    case meetupEnum.drinks:
      return ['night_club', 'bar', 'cafe', 'shopping_mall'];

    case meetupEnum.gathering:
      return ['night_club', 'bar', 'cafe', 'restaurant', 'shopping_mall'];

    case meetupEnum.hiking:
      return ['establishment'];

    case meetupEnum.photoshoot:
      return ['establishment'];

    case meetupEnum.movies:
      return ['movie_theater'];
    default:
      return ['cafe', 'restaurant', 'bakery', 'bar', 'shopping_mall'];
  }
};

export const cabFareNew = () => {
  const arr: any = [];
  for (let i = 0; i <= 60; i += 10) {
    arr.push({
      label: CabFareComp(<PriceLogo />, `${i} Credits`),
      value: i,
    });
  }
  return arr;
};

export const senderSendNewConversation = (
  myUid: string | any,
  recipientUid: string | any,
  myNickname: string | null | undefined,
  myProfileImage: string | any,
  recipientNickname: string | undefined,
  recipientProfileURL: string | undefined,
  lastMsg: string
) => {
  // firestore map key is NOT equals to ConversationInfo
  const map: { [key: string]: any } = {
    [senderKey]: myUid,
    [usersKey]: [recipientUid, myUid],
    [lastMessageKey]: lastMsg,
    [infoKey]: {
      [myUid]: {
        [nicknameKey]: myNickname?.toLowerCase(),
        [mobileUrlKey]: myProfileImage,
        [infoKey]: true,
      },
      [recipientUid]: {
        [nicknameKey]: recipientNickname?.toLowerCase(),
        [mobileUrlKey]: recipientProfileURL,
        [infoKey]: true,
      },
    },
    [senderProfileURLKey]: myProfileImage,
    [recipientNicknameKey]: recipientNickname?.toLowerCase(),
    [senderNicknameKey]: myNickname?.toLowerCase(),
    [recipientProfileURLKey]: recipientProfileURL,
  };
  return map;
};

export const getExistingConvo = (
  currentConversation: any,
  uid: string | undefined
): QueryDocumentSnapshot<DocumentData> | undefined => {
  for (let i = 0; i < (currentConversation?.data?.docs?.length ?? 0); ++i) {
    const doc = currentConversation?.data?.docs?.[i];
    if (doc?.get(usersKey).includes(uid)) {
      return doc;
    }
  }
  return undefined;
};

export const getRecipientUID = (
  myUID: string | null | undefined,
  conversation: ConversationInfo | undefined
): string | undefined => {
  if (!myUID || !conversation) return undefined;

  const users = conversation.users;

  if (users?.length > 1) {
    const filterUser = conversation?.users?.filter((id) => id !== myUID);

    if (filterUser?.length === 1) {
      const uid = filterUser[0];
      return uid;
    } else {
      return undefined;
    }
  } else {
    const info = conversation?.info;
    if (!info) return undefined;

    const keys = Object.keys(info);

    if (keys?.length > 0) {
      const filterKeys = keys?.filter((id) => id !== myUID);

      if (filterKeys?.length === 1) {
        return filterKeys[0];
      } else if (filterKeys?.length > 1) {
        const array: string[] = [];
        for (const [key, value] of Object.entries(info)) {
          if (myUID === key) continue;

          if (value.delo) {
            array.push(key);
          }
        }

        if (array?.length === 1) {
          return array[0];
        }
      } else {
        return undefined;
      }
    } else return undefined;
  }
};

export const convertDocToConvo = (
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | undefined
): ConversationInfo | undefined => {
  if (!doc) return undefined;

  const users = doc.get(usersKey) as string[];
  const sender = doc.get(senderKey) as string;

  const senderNickname = doc?.get(senderNicknameKey) as string;
  const recipientNickname = doc?.get(recipientNicknameKey) as string;

  const updatedAt = doc?.get(updatedAtKey) as Timestamp;

  const lastMessage = doc?.get(lastMessageKey) as string;

  const info = doc?.get(infoKey) as User;

  const hasOrder = doc?.get(hasOrderKey) as boolean;
  const orderTime = doc?.get(orderTimeKey) as Timestamp | undefined;

  const senderProfileURL = doc?.get(senderProfileURLKey) as string;
  const recipientProfileURL = doc?.get(recipientProfileURLKey) as string;

  const senderLastSeen = doc?.get(senderLastSeenKey) as Timestamp;
  const recipientLastSeen = doc?.get(recipientLastSeenKey) as Timestamp;
  const block = doc?.get(blockKey) as string[] | undefined;
  const order = doc?.get(orderKey) as string[] | undefined;

  const map: ConversationInfo = {
    id: doc?.id,
    hasOrder: hasOrder,
    orderTime: orderTime,
    order: order,
    sender: sender,
    users: users,
    info: info,
    updatedAt: updatedAt,
    lastMessage: lastMessage,
    senderProfileURL: senderProfileURL,
    recipientNickname: recipientNickname,
    senderLastSeen: senderLastSeen,
    recipientLastSeen: recipientLastSeen,
    senderNickname: senderNickname,
    recipientProfileURL: recipientProfileURL,
    block: block ?? [],
  };

  return map;
};
