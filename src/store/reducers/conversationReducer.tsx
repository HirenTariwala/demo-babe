import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { useAppSelector } from '../useReduxHook';

import { DocumentData, FieldValue, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { notifyLocalKey, selectedConversationLocalKey } from '@/keys/localStorageKeys';
import { deleteOnKey, lastSeenKey, mobileUrlKey, nicknameKey, pushKey, teleIdKey } from '@/keys/firestoreKeys';

export interface user {
    [uid: string] : userInfo
  }
  
  export interface userInfo {
    [nicknameKey]? : string | null | undefined
    [mobileUrlKey]? : string  | null | undefined
    [lastSeenKey]? : Timestamp | undefined
    [teleIdKey]? : string | undefined
    [deleteOnKey]? : Timestamp | undefined
    [pushKey]? : Timestamp | undefined
  }

export interface ConversationInfo {
    id: string 
    hasOrder: boolean
    orderTime: Timestamp | undefined
    order: string[] | undefined
    sender: string
    users: string[]
    updatedAt: Timestamp | FieldValue
    lastMessage: string | undefined
    info: user | undefined

    //NEW
    block: string[] | undefined
  
    // DEPRECIATED
    senderProfileURL: string | null | undefined
    senderNickname: string
    recipientProfileURL: string
    recipientNickname: string
    senderLastSeen: Timestamp | undefined
    recipientLastSeen: Timestamp | undefined
  }

export interface Iconvo {
  notification?: number | undefined;
  data?: QuerySnapshot<DocumentData> | null;
}

export interface Iconversation {
    data: ConversationInfo | undefined;
}

export interface IcurrentConvo {
  currentConvo: Iconvo;
  selectedConversation: Iconversation
}

let jsonObj = undefined
try{
  const store = sessionStorage.getItem(selectedConversationLocalKey) ?? ""
  jsonObj = JSON.parse(store) ?? undefined
}catch (err){
  console.error(err)
}

const initialState: IcurrentConvo = {
    currentConvo: {
        notification: parseInt(localStorage.getItem(notifyLocalKey) ?? '0'),
        data: undefined,
  },
  selectedConversation: {
    //@ts-expect-error
    convoData: jsonObj
  }
};

export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<Iconvo>) => {
      state.currentConvo = action.payload;
    },
    setSelectedConversation: (state, action: PayloadAction<Iconversation>) => {
        const data = action.payload;
        if (data?.data) {
          const dataValue = data.data;
          sessionStorage.setItem(
            selectedConversationLocalKey,
            JSON.stringify(dataValue)
          );
        } else {
          sessionStorage.removeItem(selectedConversationLocalKey);
        }
        state.selectedConversation = data as Iconversation
    }
  },
});

export const { setConversation,setSelectedConversation } = conversationSlice.actions;

export const useConversationStore = () => useAppSelector((state: RootState) => state?.conversations);
export const useSelectedConversationStore = () => useAppSelector((state: RootState) => state.conversations.selectedConversation?.data)

export default conversationSlice.reducer;
