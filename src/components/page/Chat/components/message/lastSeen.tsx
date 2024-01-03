import { db } from '@/credentials/firebase';
import { CONVERSATION, MESSAGES, lastSeenKey } from '@/keys/firestoreKeys';
import { doc, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

interface Props {
  chatRoomID: string;
  messageId: string;
  seen: boolean;
  isMine: boolean;
  formattedDate: string;
}

function LastSeen({ chatRoomID, messageId, seen: sn, isMine, formattedDate }: Props) {
  const [seen, setSeen] = useState<boolean>(sn);

  useEffect(() => {
    if (!sn && !isMine) {
      const batch = writeBatch(db);

      const messageRef = doc(db, CONVERSATION, chatRoomID, MESSAGES, messageId);
      // const roomRef = doc(db, CONVERSATION, chatRoomID)

      // const key = `${info}.${myUID}.${lastSeen}`
      // const now = serverTimestamp()

      batch.update(messageRef, { [lastSeenKey]: true });
      // batch.update(roomRef, {
      //     [ isMine ? senderLastSeen : recipientLastSeen ] : now,
      //     [key] : now
      // })

      batch.commit();
    }

    setSeen(sn);
  }, [sn]);

  return (
    <>
      {isMine ? (
        <>
          <p className="read">{seen && `read`}</p>
          <p>{formattedDate}</p>
        </>
      ) : (
        <p>{formattedDate}</p>
      )}
      <div />
    </>
  );
}

LastSeen.defaultProps = {};

export { LastSeen };
