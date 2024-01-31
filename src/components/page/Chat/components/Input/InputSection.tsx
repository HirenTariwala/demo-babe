import { ChangeEvent, useState } from 'react';

import { addDoc, arrayRemove, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { ConversationInfo } from '../../shared/types';
import { useUserStore } from '@/store/reducers/usersReducer';
import {
  APNSTokenKey,
  CONVERSATION,
  MESSAGES,
  blockKey,
  contentKey,
  createdAtKey,
  idKey,
  infoKey,
  lastMessageKey,
  lastSeenKey,
  mobileUrlKey,
  nicknameKey,
  pushKey,
  recipientLastSeenKey,
  recipientNicknameKey,
  recipientProfileURLKey,
  senderKey,
  senderLastSeenKey,
  senderNicknameKey,
  senderProfileURLKey,
  teleIdKey,
  typeKey,
  updatedAtKey,
  usersKey,
} from '@/keys/firestoreKeys';
import { db } from '@/credentials/firebase';
import { useRouter } from 'next/navigation';
import { messenger, nsfw, payment, sex } from '@/keys/filters';
import { MessageEnum } from '@/enum/myEnum';
import { getRecipientUID } from '@/components/page/Profile/util/helper';
import { Snackbar } from '@mui/material';
import InputBar from './InputBar';
import Box from '@/components/atoms/box';

interface InputSectionProps {
  isDisabled: boolean;
  myBlock: boolean;
  otherBlock: boolean;
  conversation: ConversationInfo;
  setInputSectionOffset?: (value: number) => void;
  replyInfo?: any;
  setReplyInfo?: (value: any) => void;
  sendMessageCallBack?: () => void;
  requestNewOrder: () => void;
  onFocus: () => void;
  openUnVerifiedModalHandler: () => void;
  onLockChat: () => void;
  lockUnlockChatLoading: boolean;
}

const InputSection = ({
  isDisabled,
  myBlock,
  otherBlock,
  conversation,
  sendMessageCallBack,
  requestNewOrder,
  onFocus,
  openUnVerifiedModalHandler,
  onLockChat,
  lockUnlockChatLoading,
}: InputSectionProps) => {
  const { currentUser } = useUserStore();
  const router = useRouter();

  const [uid, profileImage, nickname] = [
    currentUser?.uid,
    currentUser?.profileImage,
    currentUser?.nickname || currentUser?.nick,
  ];

  const isSender = conversation?.sender === uid;
  const hasMakePayment = (conversation?.order ?? []).length > 0;

  const [inputValue, setInputValue] = useState('');

  const [isOpen, setOpenToast] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  //   const [warningType, setWarningType] = useState<WarningType>(WarningType.NSFW);

  const updateTimestamp = (msg: string) => {
    const senderProfileURLValue = isSender ? profileImage : conversation.senderProfileURL;
    const recipientProfileURLValue = isSender ? conversation.recipientProfileURL : profileImage;

    const now = serverTimestamp(); // Timestamp.now()

    let users: string[];
    const info = conversation?.info;

    if (info) {
      const keys = Object?.keys(info);

      if (keys?.length === 2) users = keys;
      else if (keys?.length > 2) {
        const array: string[] = [conversation?.sender];
        for (const [key, value] of Object.entries(info)) {
          if (uid === key) continue;

          if (value?.delo) {
            array.push(key);
          }
        }

        if (array?.length === 2) {
          users = array;
        } else {
          users = conversation?.users;
        }
      } else users = conversation?.users;
    } else {
      users = conversation?.users;
    }

    const map: any = {
      [idKey]: conversation.id,
      [senderKey]: conversation.sender,
      [usersKey]: users,
      [lastMessageKey]: msg,
      [updatedAtKey]: now,
      [infoKey]: {
        [uid!]: {
          [nicknameKey]: nickname?.toLowerCase() ?? '',
          [mobileUrlKey]: profileImage ?? '',
          [lastSeenKey]: now,
          [pushKey]: now,
        },
      },
    };

    // if(currentUser?.mobileUrl){
    //   map[`${info}.${currentUser.uid}.${mobileUrl}`] = currentUser.mobileUrl.toCloudFlareURL()
    // }

    //depreciated soon
    map[isSender ? senderLastSeenKey : recipientLastSeenKey] = now;

    if (conversation?.recipientNickname) map[recipientNicknameKey] = conversation?.recipientNickname;
    if (conversation?.senderNickname) map[senderNicknameKey] = conversation?.senderNickname;

    if (recipientProfileURLValue) map[recipientProfileURLKey] = recipientProfileURLValue;
    if (senderProfileURLValue) map[senderProfileURLKey] = senderProfileURLValue;

    setDoc(doc(db, CONVERSATION, conversation?.id), map, { merge: true });
  };

  const onCloseHandleToast = () => {
    setOpenToast(false);
  };

  const sendMessage = async (onConfirmClick: boolean) => {
    if (otherBlock) {
      setOpenToast(true);
      return;
    }

    if (!nickname || !profileImage || nickname === 'undefined' || profileImage === 'undefined') {
      router.push(`/page/Admin?uid=${uid}`);
      return;
    }

    if (!inputValue.trim()) {
      return;
    }

    if (!onConfirmClick) {
      const arrays = sex?.concat(nsfw);
      if (
        arrays.some((word) => {
          return inputValue?.toLowerCase()?.includes(word);
        })
      ) {
        // setWarningType(WarningType.NSFW);
        setOpenConfirm(true);
        return;
      }

      if (!hasMakePayment) {
        const arrays = payment?.concat(messenger);
        if (
          arrays?.some((word) => {
            return inputValue?.toLowerCase().includes(word);
          })
        ) {
          //   setWarningType(WarningType.OFF_PLATFORM);
          setOpenConfirm(true);
          return;
        }
      }
    }

    setInputValue('');

    const msgerInput = document.getElementById('msger-input') as HTMLTextAreaElement;
    msgerInput.value = '';

    // reset input bar height
    sendMessageCallBack?.();

    const replacedInputValue = `${inputValue}`; // .replace(/^.{1}/g, '')

    const msg: { [id: string]: any } = {
      [senderKey]: uid,
      [contentKey]: replacedInputValue.trim(),
      [typeKey]: MessageEnum?.text?.valueOf(),
      [createdAtKey]: serverTimestamp(),
    };

    if (currentUser?.teleId) {
      msg[teleIdKey] = currentUser.teleId;
    }

    if (currentUser?.APNSToken) {
      msg[APNSTokenKey] = currentUser.APNSToken;
    }

    //adding my details into the message
    if (nickname) {
      msg[nicknameKey] = nickname;
    }
    if (profileImage) {
      msg[mobileUrlKey] = profileImage ?? '';
    }

    addDoc(collection(db, CONVERSATION, conversation.id, MESSAGES), msg);

    //.finally(scrollDown)

    scrollDown();

    updateTimestamp(replacedInputValue);

    // playSoundEffect(sendMessageSound);
  };

  const scrollDown = () => {
    const div = document?.getElementsByClassName('infinite-scroll-chatview');
    if (div && div.length > 0) {
      div[0].scrollTop = 0; // div[0].scrollHeight + 99999
    }
  };

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return;

    const inputElement = e.currentTarget as HTMLTextAreaElement;
    setInputValue(inputElement.value);
  };

  const unBlockClick = () => {
    const recipientUID = getRecipientUID(uid, conversation);

    if (!recipientUID || !uid) return;

    if (conversation.id) {
      updateDoc(doc(db, CONVERSATION, conversation.id), {
        [blockKey]: arrayRemove(uid),
      });
    }
  };

  return (
    <Box
      sx={{
        // position: 'absolute',
        // position: 'static',
        position: 'fixed',
        // bottom: 15,
        bottom: 0,
        // width: '100%',
        width: '-webkit-fill-available;',
        // maxWidth: '623px',
        borderTop: !isDisabled ? 'none' : '1px solid #999',
        // zIndex: 999,
        background: '#fff',
      }}
    >
      <InputBar
        senderUUID={conversation?.sender}
        chatRoomId={conversation?.id}
        disabled={isDisabled}
        myBlock={myBlock}
        onChange={onChangeInput}
        unBlockClick={unBlockClick}
        sendMessage={() => sendMessage(false)}
        requestNewOrder={requestNewOrder}
        onFocus={onFocus}
        openUnVerifiedModalHandler={openUnVerifiedModalHandler}
        onLockChat={onLockChat}
        lockUnlockChatLoading={lockUnlockChatLoading}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        message="This user has blocked you"
        open={isOpen}
        onClose={onCloseHandleToast}
        autoHideDuration={1500}
      />

      {/* <WarningDialog
        type={warningType}
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          sendMessage(true);
        }}
      /> */}
    </Box>
  );
};

export default InputSection;
