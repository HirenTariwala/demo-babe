import { deleteOnKey, lastSeenKey, mobileUrlKey, nicknameKey, pushKey, teleIdKey } from '@/keys/firestoreKeys';
import { FieldValue, Timestamp } from 'firebase/firestore';

export interface UserInfo {
  [nicknameKey]?: string | null | undefined;
  [mobileUrlKey]?: string | null | undefined;
  [lastSeenKey]?: Timestamp | undefined;
  [teleIdKey]?: string | undefined;
  [deleteOnKey]?: Timestamp | undefined;
  [pushKey]?: Timestamp | undefined;
}
export interface User {
  [uid: string]: UserInfo;
}

export interface ConversationInfo {
  id: string;
  hasOrder: boolean;
  orderTime: Timestamp | undefined;
  order: string[] | undefined;
  sender: string;
  users: string[];

  updatedAt: Timestamp | FieldValue;
  lastMessage: string | undefined;

  info: User | undefined;

  // NEW
  block: string[] | undefined;

  // DEPRECIATED
  senderProfileURL: string | null | undefined;
  senderNickname: string;

  recipientProfileURL: string;
  recipientNickname: string;

  senderLastSeen: Timestamp | undefined;
  recipientLastSeen: Timestamp | undefined;
}

export interface MessageItem {
  id?: string;
  sender: string;
  content: string;
  replyTo?: string;
  createdAt: Timestamp;
  type: 'text' | 'image' | 'file' | 'sticker' | 'removed';
}
