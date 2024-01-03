import { FC, useState } from 'react';
import {
  collection,
  DocumentData,
  limitToLast,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
// import { RBACType } from '@/props/types/rbacType';
import {
  CancelRejectProps,
  // ClubProps
} from '@/props/commonProps';
import { ListChildComponentProps } from 'react-window';
import {
  CONVERSATION,
  MESSAGES,
  chatRoomIdKey,
  clubKey,
  // contentKey,
  createdAtKey,
  lastMessageKey,
  // lastSeenKey,
  // mobileUrlKey,
  // orderKey,
  // senderKey,
  stateKey,
  typeKey,
  // urlKey,
  // verifiedKey,
} from '@/keys/firestoreKeys';
// import { MessageEnum, RBACEnum } from '@/enum/myEnum';
import MessageBubble from '@/components/molecules/card/messagebubble';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useSelectedConversationStore } from '@/store/reducers/conversationReducer';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Helper } from '@/utility/helper';
import { useCollectionQuery } from '../hook/useCollectionQuery';
import { db } from '@/credentials/firebase';
import Box from '@/components/atoms/box';
import LoadingIcon from '@/components/atoms/icons/loading';
import VariableWindowList from '@/components/organisms/list/VariableWindowList';

interface ChatViewProps {
  myBlock: boolean;
  otherBlock: boolean;
  requestNewOrder: () => void;
  onFocus: () => void;
}
//   const chatRoomId = conversation?.id ?? chatRoomID
// tipOnClick={() => setOpen(true)}
// openCashBackDialog={() => setCashBack(true)}
const Row =
  (
    uid: string | null | undefined,
    chatRoomId: string | undefined
    // userRBAC: RBACType,
    // tipOnClick: () => void,
    // requestNewOrder: () => void,
    // openGovDialogHandler: () => void,
    // openCashBackDialog: () => void,
    // onRejectCancel: (data: CancelRejectProps) => void
  ) =>
  // eslint-disable-next-line react/display-name
  // ({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[] | null | undefined>) => {
  ({ index, style, data }: ListChildComponentProps<any>) => {
    const doc = data?.[index];
    console.log(style);

    if (!doc || !data) return null;

    // const sender = doc?.get(senderKey) as string | undefined;
    // const isMine = uid === sender;
    // const msg = doc?.get(contentKey) as string;
    const createAt = (doc?.get(createdAtKey) as Timestamp) ?? Timestamp.now();

    // const seen = (doc?.get(lastSeenKey) as boolean) ?? false;
    // const verified = doc?.get(verifiedKey) as boolean | undefined;
    // const url = doc?.get(urlKey) as string | undefined;
    const type = doc?.get(typeKey) as number;
    // const club = doc?.get(clubKey) as ClubProps;

    // const order = doc?.get(orderKey) as { [key: string]: any } | undefined;
    // const babeUID = order?.['babeUID'] as string | undefined;
    // const babeProfileImage = order?.['babeProfileImage'] as string | undefined;
    // const clientProfileImage = order?.['clientProfileImage'] as string | undefined;

    // const profileImage = doc?.get(mobileUrlKey) as string | undefined;
    // const showProfileImage =
    //   userRBAC === RBACEnum.admin && window?.location?.href.getURLEnd().toLowerCase() === 'chatview';
    // const showProfileImage = false;

    if (!chatRoomId) return null;
    <MessageBubble
      messageData={{
        status: type || '',
        date: createAt,
        time: createAt,
        price: 250,
      }}
      rate={doc?.get(lastMessageKey)}
      services=""
    />;
    // else if (type === MessageEnum?.text)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <BubbleMessage
    //         sender={_sender}
    //         index={index}
    //         url={_profileImage}
    //         verified={_verified}
    //         chatRoomID={chatRoomId}
    //         messageId={doc.id}
    //         seen={seen}
    //         createdAt={createAt}
    //         key={doc.id}
    //         msg={msg}
    //         isMine={isMine}
    //         showProfileImage={showProfileImage}
    //       />
    //     </div>
    //   );
    // else if (_type === MessageEnum.payRequest)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <PaymentBubble
    //         url={_url}
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
    // else if (_type === MessageEnum.warning)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <WarningBubble index={index} msg={msg} />
    //     </div>
    //   );
    // else if (_type === MessageEnum.paid)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <PaidBubble index={index} data={doc} tipOnClick={tipOnClick} openCashBackDialog={openCashBackDialog} />
    //     </div>
    //   );
    // else if (_type === MessageEnum.order)
    //   return (
    //     <div style={{ ...style }} key={index}>
    //       <RequestOrderBubble
    //         babeUID={_babeUID}
    //         clientProfileImage={_clientProfileImage}
    //         babeProfileImage={_babeProfileImage}
    //         sender={_sender}
    //         showProfileImage={showProfileImage}
    //         club={_club}
    //         order={doc.get(order) as any}
    //         status={(doc.get(status) as number) ?? option.pending}
    //         rejectedReason={doc.get(reject_reason) as string | undefined}
    //         index={index}
    //         chatRoomID={chatRoomId}
    //         messageId={doc.id}
    //         seen={seen}
    //         createdAt={createAt}
    //         key={doc.id}
    //         msg={msg}
    //         isMine={isMine}
    //         requestNewOrder={requestNewOrder}
    //         openGovDialog={openGovDialogHandler}
    //         link={doc.get(pay_link) as string | undefined}
    //         serviceDetails={doc.get('order')['serviceDetails'] as ServiceDetails | undefined}
    //         onRejectCancel={onRejectCancel}
    //       />
    //     </div>
    //   );
    // else
    //   return (
    //     <div style={style} key={index}>
    //       <UpdateBubble type={_type} index={index} isMine={isMine} />
    //     </div>
    //   );
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatView = ({ myBlock, otherBlock, requestNewOrder, onFocus }:ChatViewProps) => {
  const clubName = sessionStorage.getItem(clubKey);
  const clubState = sessionStorage.getItem(stateKey);
  const headerSize = clubName && clubState ? 44 : 0;

  const textAreaHeight = 42;
  const textAreaWrapperHeight = 80;

  const [size] = useWindowSize();

  const { currentUser } = useUserStore();

  const chatRoomID = Helper?.getQueryStringValue(chatRoomIdKey);

  const conversation = useSelectedConversationStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uid, isVerified, rejectedReasonAfter, userRBAC] = [
    currentUser?.uid,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
    currentUser?.userRBAC,
  ];
  const calculateChats = () => {
    const calculation = (size?.height - 144 - 116 - 56) / 38;
    const numOfChats = Math?.floor(calculation) + 2;
    // const count =  numOfChats < 12 ? 12 : numOfChats

    return numOfChats; // count + 2
  };
  const [limitCount, setLimitCount] = useState<number>(calculateChats());
  const [heightIncrease, setHeightIncrease] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openRejectCancelDialog, setRejectCancelDialog] = useState<CancelRejectProps | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openCashBack, setCashBack] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openGovDialog, setGovDialog] = useState<boolean>(false);

  const { loading, error, data, hasNextPage } = useCollectionQuery(
    `${conversation?.id}-chatview`,
    uid && conversation?.info && conversation?.info[uid]?.delo
      ? query(
          collection(db, CONVERSATION, conversation.id, MESSAGES),
          where(
            createdAtKey,
            '>',
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            new Timestamp(conversation?.info?.[uid]?.delo?.seconds!, conversation?.info?.[uid]?.delo?.nanoseconds!)
          ),
          orderBy(createdAtKey),
          limitToLast(limitCount)
        )
      : query(
          collection(db, CONVERSATION, `${conversation?.id ?? chatRoomID}`, MESSAGES),
          orderBy(createdAtKey),
          limitToLast(limitCount)
        ),
    limitCount,
    true
  );

  // const tipOnClick = () => {
  //   setOpen(true);
  // };

  // const openCashBackDialog = () => {
  //   setCashBack(true);
  // };

  // const onCancelRejectHandler = (data: CancelRejectProps) => {
  //   setRejectCancelDialog(data);
  // };

  // const openGovDialogHandler = () => {
  //   setGovDialog(true);
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const autoGrow = (value: any) => {
    const element = value.target;

    element.style.height = 'auto';
    // WARNING: Must set height to auto first to get scroll height
    const scrollHeight = element.scrollHeight > 150 ? 150 : element.scrollHeight;
    element.style.height = `${scrollHeight}px`;

    const increaseBy = scrollHeight - textAreaHeight;

    const wrapper = document.getElementById('msger-inputarea-wrapper') as HTMLDivElement;

    if (wrapper && scrollHeight > textAreaHeight) wrapper.style.height = `${textAreaWrapperHeight + increaseBy}px`;
    else if (wrapper) wrapper.style.height = `${textAreaWrapperHeight}px`;

    if (scrollHeight > textAreaHeight) setHeightIncrease(increaseBy);
    else setHeightIncrease(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendMessage = () => {
    const textarea = document.getElementById('msger-input') as HTMLAreaElement;
    if (textarea) textarea.style.height = `${textAreaHeight}px`;

    const wrapper = document.getElementById('msger-inputarea-wrapper') as HTMLDivElement;
    if (wrapper) wrapper.style.height = `${textAreaWrapperHeight}px`;

    setHeightIncrease(0);
  };

  const loadNextPage = () => {
    if (hasNextPage) {
      setLimitCount((prev) => {
        return prev + 10; // calculateChats()  //10
      });
    }
  };

  if (loading || (data?.length as number) === 0)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <LoadingIcon />
      </Box>
    );
  else if (error)
    return (
      <div style={{ height: '100vh' }}>
        <p>Something went wrong</p>
      </div>
    );
  else
    return (
      <>
        <Box position="relative" bgcolor="white" className="chat-background">
          <VariableWindowList
            style={{ transform: 'scaleY(-1)' }}
            height={
              size.width > 600
                ? size.height - 80 - 50 - 90 - heightIncrease - headerSize
                : size.height - 48 - 24 - 80 - heightIncrease - headerSize
            }
            width={'100%'}
            hasNextPage={hasNextPage}
            data={data}
            overScan={4}
            loadNextPage={loadNextPage}
            //@ts-ignore
            component={Row(
              uid,
              conversation?.id ?? chatRoomID
              // userRBAC,
              // tipOnClick,
              // requestNewOrder,
              // openGovDialogHandler,
              // openCashBackDialog,
              // onCancelRejectHandler
            )}
            scrollReversed
          />

          {/* <InputSection
            myBlock={myBlock}
            otherBlock={otherBlock}
            sendMessageCallBack={sendMessage}
            onInput={autoGrow}
            conversation={conversation!}
            requestNewOrder={requestNewOrder}
            isDisabled={conversation?.hasOrder ? false : true}
            onFocus={onFocus}
          /> */}
        </Box>
        {/* 
        {currentUser?.nickname && currentUser?.uid && (
          <SendTipDialog chatRoomId={conversation!.id} open={open} onClose={() => setOpen(false)} />
        )}

        <RejectCancelDialog
          data={openRejectCancelDialog}
          open={!!openRejectCancelDialog}
          onClose={() => setRejectCancelDialog(null)}
        />

        <CashBackDialog open={openCashBack} onClose={() => setCashBack(false)} />

        {openGovDialog && (
          <GovDialog
            open={openGovDialog}
            onClose={() => setGovDialog(false)}
            myUID={uid}
            verified={isVerified}
            rejectedReasonAfter={rejectedReasonAfter}
          />
        )} */}
      </>
    );
};

export default ChatView;
