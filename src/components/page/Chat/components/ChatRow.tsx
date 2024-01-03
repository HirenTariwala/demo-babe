'use client'
import MessageBubble from '@/components/molecules/card/messagebubble';
import {
  MessageEnum,
  // RBACEnum
} from '@/enum/myEnum';
import {
  //   clubKey,
  // contentKey,
  // createdAtKey,
  // lastSeenKey,
  // mobileUrlKey,
  //   orderKey,
  //   payLinkKey,
  //   rejectReasonKey,
  // senderKey,
  //   statusKey,
  typeKey,
  //   urlKey,
  // verifiedKey,
} from '@/keys/firestoreKeys';
// import { CancelRejectProps, ClubProps } from '@/props/commonProps';
// import { ServiceDetails } from '@/props/servicesProps';
// import { RBACType } from '@/props/types/rbacType';
// import { Helper } from '@/utility/helper';
import {
  DocumentData,
  QueryDocumentSnapshot,
  // Timestamp
} from 'firebase/firestore';
import React from 'react';
import { ListChildComponentProps } from 'react-window';

const ChatRow =
  (
    uid: string | null | undefined,
    chatRoomId: string | null
    // userRBAC: RBACType
    // tipOnClick: () => void,
    // // requestNewOrder: () => void,
    // openGovDialogHandler: () => void,
    // openCashBackDialog: () => void,
    // onRejectCancel: (data: CancelRejectProps) => void
  ) =>
  // eslint-disable-next-line react/display-name
  ({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[] | null | undefined>) => {
    const doc = data?.[index];

    if (!doc || !data) return null;

    // const sender = doc.get(senderKey) as string | undefined;
    // const isMine = uid === sender;
    // const msg = doc.get(contentKey) as string;
    // const createAt = (doc.get(createdAtKey) as Timestamp) ?? Timestamp?.now();

    // const seen = (doc.get(lastSeenKey) as boolean) ?? false;
    // const verified = doc.get(verifiedKey) as boolean | undefined;
    // const url = doc.get(urlKey) as string | undefined;
    const type = doc.get(typeKey) as number;
    // const club = doc.get(clubKey) as ClubProps;

    // const order = doc.get(orderKey) as { [key: string]: any } | undefined;
    // const babeUID = order?.['babeUID'] as string | undefined;
    // const babeProfileImage = order?.['babeProfileImage'] as string | undefined;
    // const clientProfileImage = order?.['clientProfileImage'] as string | undefined;

    // const profileImage = doc.get(mobileUrlKey) as string | undefined;
    // const showProfileImage = userRBAC === RBACEnum.admin && Helper?.getURLEnd()?.toLowerCase() === 'chatview';

    if (!chatRoomId) return null;
    else if (type === MessageEnum?.text)
      return (
        <div style={{ ...style }} key={index}>
          <MessageBubble
            messageData={{
              data: '',
              price: '',
              status: 'expired',
              time: '',
            }}
            rate="450/10min"
            services="E-meet"
            // sender={sender}
            // index={index}
            // url={profileImage}
            // verified={verified}
            // chatRoomID={chatRoomId}
            // messageId={doc.id}
            // seen={seen}
            // createdAt={createAt}
            // key={doc.id}
            // msg={msg}
            // isMine={isMine}
            // showProfileImage={showProfileImage}
          />
        </div>
      );
    else {
      return null;
    }
    // else if (type === MessageEnum?.payRequest)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <PaymentBubble
    //         url={url}
    //         index={index}
    //         chatRoomID={chatRoomId}
    //         messageId={doc.id}
    //         seen={seen}
    //         createdAt={createAt}
    //         key={doc.id}
    //         msg={msg}
    //         isMine={isMine}
    //       />
    //     </div>
    //   );
    // else if (type === MessageEnum?.warning)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <WarningBubble index={index} msg={msg} />
    //     </div>
    //   );
    // else if (type === MessageEnum?.paid)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <PaidBubble index={index} data={doc} tipOnClick={tipOnClick} openCashBackDialog={openCashBackDialog} />
    //     </div>
    //   );
    // else if (type === MessageEnum?.order)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <RequestOrderBubble
    //         babeUID={babeUID}
    //         clientProfileImage={clientProfileImage}
    //         babeProfileImage={babeProfileImage}
    //         sender={sender}
    //         showProfileImage={showProfileImage}
    //         club={club}
    //         order={doc.get(orderKey) as any}
    //         status={(doc.get(statusKey) as number) ?? option.pending}
    //         rejectedReason={doc.get(rejectReasonKey) as string | undefined}
    //         index={index}
    //         chatRoomID={chatRoomId}
    //         messageId={doc.id}
    //         seen={seen}
    //         createdAt={createAt}
    //         key={doc.id}
    //         msg={msg}
    //         isMine={isMine}
    //         // requestNewOrder={requestNewOrder}
    //         openGovDialog={openGovDialogHandler}
    //         link={doc.get(payLinkKey) as string | undefined}
    //         serviceDetails={doc.get('order')['serviceDetails'] as ServiceDetails | undefined}
    //         onRejectCancel={onRejectCancel}
    //       />
    //     </div>
    //   );
    // else
    //   return (
    //     <div style={style} key={index}>
    //       <UpdateBubble type={type} index={index} isMine={isMine} />
    //     </div>
    //   );
  };

export default ChatRow;
