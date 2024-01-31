import { useState } from 'react';
import {
  collection,
  doc,
  DocumentData,
  limitToLast,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
import { RBACType } from '@/props/types/rbacType';
import { CancelRejectProps } from '@/props/commonProps';
import { ListChildComponentProps } from 'react-window';
import {
  CONVERSATION,
  MESSAGES,
  ORDER,
  chatRoomIdKey,
  clubKey,
  createdAtKey,
  idKey,
  infoKey,
  stateKey,
} from '@/keys/firestoreKeys';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useSelectedConversationStore } from '@/store/reducers/conversationReducer';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Helper } from '@/utility/helper';
import { useCollectionQuery } from '../hook/useCollectionQuery';
import { db } from '@/credentials/firebase';
import Box from '@/components/atoms/box';
import LoadingIcon from '@/components/atoms/icons/loading';
import VariableWindowList from '@/components/organisms/list/VariableWindowList';
import InputSection from './Input/InputSection';
import styles from '../chat.module.css';
import MessageWrapper from './message/MessageWrapper';
import SendTipDialog from './Dialog/SendTipDialog';
import ReviewModal from '../../Order/components/reviewModal';
import { useMediaQuery } from '@mui/material';
import RejectCancelDialog from './Dialog/RejectCancelDialog';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import RefundModal from '../../Order/components/refundModal';

interface ChatViewProps {
  myBlock: boolean;
  otherBlock: boolean;
  requestNewOrder: () => void;
  onFocus: () => void;
  onLockChat: () => void;
  lockUnlockChatLoading: boolean;
  openUnVerifiedModalHandler: () => void;
}
//   const chatRoomId = conversation?.id ?? chatRoomID
// tipOnClick={() => setOpen(true)}
// openCashBackDialog={() => setCashBack(true)}
const Row =
  (
    uid: string | null | undefined,
    chatRoomId: string | undefined,
    userRBAC: RBACType,
    tipOnClick: () => void,
    reviewOnClick: (arg: number) => void,
    refundOnClick: (arg: any) => void,
    requestNewOrder: () => void,
    openUnVerifiedModalHandler: () => void,
    openCashBackDialog: () => void,
    onRejectCancel: (data: CancelRejectProps) => void
  ) =>
  // eslint-disable-next-line react/display-name
  // ({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[] | null | undefined>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, react/display-name
  ({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[]>) => {
    const doc = data?.[index];

    if (!doc || !data) return null;

    if (!chatRoomId) return null;
    else {
      return (
        <Box
          key={index}
          style={{ ...style }}
          sx={{
            marginTop: `${index * 10}px`,
          }}
        >
          <MessageWrapper
            doc={doc}
            uid={uid}
            userRBAC={userRBAC}
            index={index}
            chatRoomId={chatRoomId}
            onRejectCancel={onRejectCancel}
            openCashBackDialog={openCashBackDialog}
            openUnVerifiedModalHandler={openUnVerifiedModalHandler}
            requestNewOrder={requestNewOrder}
            tipOnClick={tipOnClick}
            reviewOnClick={reviewOnClick}
            refundOnClick={refundOnClick}
          />
        </Box>
      );
    }
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatView = ({
  myBlock,
  otherBlock,
  requestNewOrder,
  onLockChat,
  lockUnlockChatLoading,
  onFocus,
  openUnVerifiedModalHandler,
}: ChatViewProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const clubName = sessionStorage.getItem(clubKey);
  const clubState = sessionStorage.getItem(stateKey);
  // const headerSize = clubName && clubState ? 44 : 0;
  const headerSize = clubName && clubState ? 77 : 77;

  const textAreaHeight = 42;
  const textAreaWrapperHeight = 80;

  const [size] = useWindowSize();

  const { currentUser } = useUserStore();

  const chatRoomID = Helper?.getQueryStringValue(chatRoomIdKey);

  const conversation = useSelectedConversationStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uid, isVerified, rejectedReasonAfter, userRBAC, nickname] = [
    currentUser?.uid,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
    currentUser?.userRBAC,
    currentUser?.nickname,
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
  const [isOpenTip, setOpenTip] = useState<boolean>(false);
  const [isOpenReview, setOpenReview] = useState<boolean>(false);
  const [isOpenRefund, setOpenRefund] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openCashBack, setCashBack] = useState<boolean>(false);

  // const [isOpenUnVerifiedModal, setIsOpenUnVerifiedModal] = useState<boolean>(false);

  const [index, setIndex] = useState(0);

  // const onCloseToast = () => {
  //   setOpenToast(false);
  // };
  // const onOpenToastWithMsg = (msg: string) => {
  //   setToastMsg(msg);
  //   setOpenToast(true);
  // };

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
  const { data: orderData } = useDocumentQuery(
    `order-data-${orderInfo}`,
    orderInfo ? doc(db, ORDER, orderInfo) : undefined
  );
  const orderDetails = orderData?.data();
  const temp = data?.[index]?.data()?.[infoKey];
  const filterUser = temp ? Object.keys(temp).filter((id) => id !== uid) : '';
  const otherUid = filterUser?.length > 0 ? filterUser[0] : '';
  const babeDetails = temp?.[otherUid];
  const btemp = orderDetails?.[infoKey] ? Object?.keys(orderDetails?.[infoKey])?.filter((id) => id !== uid) : '';
  const bInfoRefund = orderDetails?.[infoKey]?.[btemp[0]];

  const tipOnClick = () => {
    setOpenTip(true);
  };
  const reviewOnClick = (value: number) => {
    setIndex(value);
    setOpenReview(true);
  };

  const refundOnClick = (order: any) => {
    setOrderInfo(order);
    setOpenRefund(true);
  };

  const openCashBackDialog = () => {
    setCashBack(true);
  };

  const onRejectCancel = (data: CancelRejectProps) => {
    setRejectCancelDialog(data);
  };

  // const openUnVerifiedModalHandler = () => {
  //   setIsOpenUnVerifiedModal(true);
  // };

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
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <LoadingIcon />
      </Box>
    );
  else if (error)
    return (
      <Box sx={{ height: '100vh' }}>
        <p>Something went wrong</p>
      </Box>
    );
  else
    return (
      <>
        <Box
          position="relative"
          bgcolor="white"
          className={conversation?.hasOrder ? styles.chatMsgListIsChatEnable : styles.chatMsgList}
        >
          <VariableWindowList
            style={{ transform: 'scaleY(-1)' }}
            height={
              size.width > 600
                ? size?.height - 80 - 50 - (conversation?.hasOrder ? -20 : 20) - heightIncrease - headerSize
                : size?.height - 48 - 24 - 90 - heightIncrease - headerSize
            }
            width={'100%'}
            hasNextPage={hasNextPage}
            data={data}
            overScan={4}
            loadNextPage={loadNextPage}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            component={Row(
              uid,
              conversation?.id ?? chatRoomID,
              userRBAC,
              tipOnClick,
              reviewOnClick,
              refundOnClick,
              requestNewOrder,
              openUnVerifiedModalHandler,
              openCashBackDialog,
              onRejectCancel
            )}
            scrollReversed
          />
        </Box>
        <InputSection
          myBlock={myBlock}
          otherBlock={otherBlock}
          sendMessageCallBack={sendMessage}
          // onInput={autoGrow}
          conversation={conversation!}
          requestNewOrder={requestNewOrder}
          isDisabled={conversation?.hasOrder ? false : true}
          onFocus={onFocus}
          openUnVerifiedModalHandler={openUnVerifiedModalHandler}
          onLockChat={onLockChat}
          lockUnlockChatLoading={lockUnlockChatLoading}
        />

        {(currentUser?.nickname || currentUser?.nick) && currentUser?.uid && (
          <SendTipDialog chatRoomId={conversation!.id} open={isOpenTip} onClose={() => setOpenTip(false)} />
        )}

        <RejectCancelDialog
          data={openRejectCancelDialog}
          open={!!openRejectCancelDialog}
          onClose={() => setRejectCancelDialog(null)}
        />

        {/* <CashBackDialog open={openCashBack} onClose={() => setCashBack(false)} /> */}

        <ReviewModal
          isMobile={isMobile}
          isTablet={isTablet}
          isOpen={isOpenReview}
          setOpen={setOpenReview}
          babeDetails={{
            name: babeDetails?.nick,
            profile: babeDetails?.u,
            reviewLink: babeDetails?.link,
            myUID: uid,
            currentUserName: currentUser?.nickname || currentUser?.nick,
          }}
        />

        <RefundModal
          isMobile={isMobile}
          isTablet={isMobile}
          isOpen={isOpenRefund}
          setOpen={setOpenRefund}
          orderId={orderDetails?.[idKey]}
          myUid={uid}
          orderDetails={{
            service: orderDetails?.services?.details,
            details: {
              name: bInfoRefund?.nick,
              profile: bInfoRefund?.u,
              chatRoomId: orderDetails?.cri,
              messageID: orderDetails?.mid,
              price: orderDetails?.pr,
            },
          }}
        />
      </>
    );
};

export default ChatView;
