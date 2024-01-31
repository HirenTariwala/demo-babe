import Box from '@/components/atoms/box';
import ChatBubble from '@/components/molecules/card/chatBubble';
import { VariableWindowListContext } from '@/components/organisms/list/VariableWindowList';
import { MessageEnum, RBACEnum, option } from '@/enum/myEnum';
import {
  ORDER,
  REVIEWS,
  clubKey,
  contentKey,
  createdAtKey,
  idKey,
  infoKey,
  lastSeenKey,
  mobileUrlKey,
  orderKey,
  payLinkKey,
  rejectReasonKey,
  senderKey,
  statusKey,
  typeKey,
  urlKey,
  verifiedKey,
} from '@/keys/firestoreKeys';

import { CancelRejectProps, ClubProps } from '@/props/commonProps';
import { ServiceDetails } from '@/props/servicesProps';
import { RBACType } from '@/props/types/rbacType';
import { Helper } from '@/utility/helper';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot, Timestamp, doc as firebaseDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import PaymentBubble from './PaymentBubble';
import WarningBubble from './WarningBubble';
import BabeMessageCard from '@/components/molecules/card/messagecard';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import { db } from '@/credentials/firebase';

interface IMessageWrapper {
  doc: QueryDocumentSnapshot<DocumentData>;
  uid: string | undefined | null;
  userRBAC: RBACType;
  index: number;
  chatRoomId: string;
  requestNewOrder: () => void;
  tipOnClick: () => void;
  reviewOnClick: (arg: number) => void;
  refundOnClick: (arg: any) => void;
  openUnVerifiedModalHandler: () => void;
  openCashBackDialog: () => void;
  onRejectCancel: (data: CancelRejectProps) => void;
}
const MessageWrapper = ({
  doc,
  uid,
  userRBAC,
  index,
  chatRoomId,
  requestNewOrder,
  tipOnClick,
  reviewOnClick,
  refundOnClick,
  openUnVerifiedModalHandler,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openCashBackDialog,
  onRejectCancel,
}: IMessageWrapper) => {
  const { size, setSize } = useContext(VariableWindowListContext);
  const sender = doc?.get(senderKey) as string | undefined;
  const isMine = uid === sender;

  const msg = doc?.get(contentKey) as string;
  const createAt = (doc?.get(createdAtKey) as Timestamp) ?? Timestamp?.now();

  const seen = (doc?.get(lastSeenKey) as boolean) ?? false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const verified = doc?.get(verifiedKey) as boolean | undefined;
  const url = doc?.get(urlKey) as string | undefined;
  const type = doc?.get(typeKey) as number;

  const club = doc?.get(clubKey) as ClubProps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stat = doc?.get(statusKey);

  const order = doc?.get(orderKey) as { [key: string]: any } | undefined;
  const babeUID = order?.['babeUID'] as string | undefined;
  const babeProfileImage = order?.['babeProfileImage'] as string | undefined;
  const clientProfileImage = order?.['clientProfileImage'] as string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const profileImage = doc?.get(mobileUrlKey) as string | undefined;
  const showProfileImage = userRBAC === RBACEnum?.admin && Helper?.getURLEnd()?.toLowerCase() === 'chatview';
  // const showProfileImage = false;

  const date = Helper?.timeStempToDate(createAt);

  const msgArray = msg?.split('\n');

  const { data: orderData } = useDocumentQuery(
    `order-data-${doc?.get(idKey)}`,
    doc?.get(idKey) ? firebaseDoc(db, ORDER, doc?.get(idKey)) : undefined
  );
  const temp = orderData?.get(infoKey);
  const filterUser = temp ? Object.keys(temp).filter((id) => id !== uid) : '';
  const otherUid = filterUser?.length > 0 ? filterUser[0] : '';
  const babeDetails = temp?.[otherUid];
  const sidMatch = babeDetails?.link?.match(/[?&]sid=([^&]+)/);
  const sid = sidMatch ? sidMatch[1] : null;

  const { data: reviewData } = useDocumentQuery(`review-data-${sid}`, sid ? firebaseDoc(db, REVIEWS, sid) : undefined);

  useEffect(() => {
    const root = document?.getElementById(`${index?.toString()}-chat`);
    const height = root?.getBoundingClientRect()?.height ?? 0;

    setSize?.(index, height);
  }, [size?.width, orderData, reviewData]);

  return (
    <Box id={`${index?.toString()}-chat`}>
      {type === MessageEnum.text ? (
        <ChatBubble msg={msg} isMine={isMine} lastSeen={dayjs(date)?.format('hh:mm A')} />
      ) : type === MessageEnum.payRequest ? (
        <PaymentBubble
          url={url}
          index={index}
          chatRoomID={chatRoomId}
          messageId={doc?.id}
          seen={seen}
          createdAt={createAt}
          key={doc?.id}
          msg={msg}
          isMine={isMine}
        />
      ) : type === MessageEnum.warning ? (
        <WarningBubble index={index} msg={msg} />
      ) : type === MessageEnum.paid ? (
        <BabeMessageCard
          index={index}
          data={doc}
          tipOnClick={tipOnClick}
          reviewOnClick={reviewOnClick}
          refundOnClick={refundOnClick}
          orderData={orderData}
          reviewData={reviewData}
        />
      ) : type === MessageEnum.order ? (
        <MessageBubble
          babeUID={babeUID}
          clientProfileImage={clientProfileImage}
          babeProfileImage={babeProfileImage}
          sender={sender}
          showProfileImage={showProfileImage}
          club={club}
          order={doc.get(orderKey) as any}
          status={(doc.get(statusKey) as number) ?? option.pending}
          rejectedReason={doc.get(rejectReasonKey) as string | undefined}
          index={index}
          chatRoomID={chatRoomId}
          messageId={doc.id}
          seen={seen}
          createdAt={createAt}
          key={doc.id}
          msg={msg}
          msgArr={msgArray}
          isMine={isMine}
          date={date}
          requestNewOrder={requestNewOrder}
          openUnVerifiedModalHandler={openUnVerifiedModalHandler}
          link={doc.get(payLinkKey) as string | undefined}
          serviceDetails={doc.get('order')['serviceDetails'] as ServiceDetails | undefined}
          onRejectCancel={onRejectCancel}
        />
      ) : (
        'UpdateBubble Card Not Availabel'
      )}
    </Box>
  );
};

export default MessageWrapper;
