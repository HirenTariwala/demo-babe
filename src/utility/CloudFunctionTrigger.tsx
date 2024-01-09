import { functions } from '@/credentials/firebase';
import { lockChatFunction } from '@/keys/functionNames';
import { httpsCallable } from 'firebase/functions';

export enum LockEnum {
  LOCKED,
  UNLOCKED,
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function lockChat(chatRoomID: string, lockType?: LockEnum): Promise<any> {
  //   try {
  //     const name = `${lockType === LockEnum.LOCKED ? 'lock' : 'unlock'} chat`;
  //     logEvent(analytics, AnalyticsNames.buttons, {
  //       content_type: name,
  //       item_id: name,
  //     });
  //   } catch {}

  //   playSoundEffect(lockSound);

  const lockChat = httpsCallable(functions, lockChatFunction);
  return lockChat({
    chatRoomId: chatRoomID,
  });
}
