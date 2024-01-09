'use client';
import Box from '@/components/atoms/box';
import ArrowForwardIcon from '@/components/atoms/icons/arrowForwardIcon';
import React from 'react';
import styles from './chat.module.css';
import Tabs from '@/components/atoms/tabs';
import useChatHook from './useChatHook';
import ReactWindowList from '@/components/organisms/list/ReactWindowList';
import EmptyData from '@/components/molecules/EmptyData';
import EmptyBoxIcon from '@/components/atoms/icons/emptyBoxIcon';
// import Typography from '@/components/atoms/typography';
import ChatBox from './components/ChatBox';

interface IChat {
  onDrawerClose?: () => void;
}
// const ChatHeader = () => {
//   return (
//     <Box className={styles.chatBoxHeaderSection}>
//       <Box>
//         IMG
//         {/* <NextImage src={} /> */}
//       </Box>
//       <Box flex={'1 0 0'}>
//         <Typography variant="h3" color={'#1A1A1A'} fontWeight={500}>
//           limblake
//         </Typography>
//         <Typography variant="body2" color={'#999'} fontWeight={500}>
//           Last seen 2 hours ago
//         </Typography>
//       </Box>
//       <Box>:</Box>
//     </Box>
//   );
// };
const Chat = ({ onDrawerClose }: IChat) => {
  const {
    tabsData,
    dataConversation,
    dataHasNextPage,
    errorChat,
    loadingChat,
    size,
    // headerSize,
    // uid,
    // heightIncrease,
    // isVerified,
    // rejectedReasonAfter,
    // userRBAC,
    // chatRoomID,
    // conversation,
    loadNextPage,
    calculateSideBarWidth,
    Row,
    // selectedConversation,
    // currentUser,
    // chatUUID,
    // isUserDataLoading,
    // userData,
    // onCancelRejectHandler,
    // openGovDialogHandler,
    // tipOnClick,
    // openCashBackDialog,
  } = useChatHook();

  if (loadingChat || errorChat) {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box className={styles.userList}>Loading ... </Box>
      </Box>
    );
  }

  if (!(dataConversation?.size as number)) {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box>
          <EmptyData icon={<EmptyBoxIcon />} msg="You have no messages yet" />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box className={styles.userListSection}>
        <Box className={styles.backArrowHeader}>
          <Box className={styles.backArrowButton} onClick={() => (onDrawerClose ? onDrawerClose() : '')}>
            <ArrowForwardIcon />
          </Box>
        </Box>
        <Box className={styles.userList}>
          <Box>
            <Tabs mainClass={'main_tabs'} tabsData={tabsData} />
          </Box>
          <Box className={styles.userListArr}>
            <ReactWindowList
              height={size?.height - 56}
              width={calculateSideBarWidth()}
              hasNextPage={dataHasNextPage}
              dataSize={dataConversation?.size as number}
              loadNextPage={() => loadNextPage()}
              component={Row}
              itemSize={73}
            />
          </Box>
        </Box>
      </Box>
      <Box className={styles.chatBoxSection}>
        <ChatBox loading={loadingChat} />
        {/* <Box className={styles.chatBoxBody}>
          <Box className={styles.chatBodyContent}>
            {Array(2000)
              ?.fill('Hello')
              ?.map((_, index) => {
                return <Box key={index}>Hello {index + 1}</Box>;
              })}
          </Box>
        </Box> */}
      </Box>

      {/* <ReactWindowList
            height={size?.height - 56}
            width={calculateSideBarWidth()}
            hasNextPage={dataHasNextPage}
            dataSize={dataConversation?.length as number}
            loadNextPage={() => loadNextPage()}
            component={Row}
            itemSize={73}
          /> */}

      {/* {selectedUser?.nickname && selectedUser?.uid && (
          <SendTipDialog chatRoomId={conversation!.id} open={open} onClose={() => setOpen(false)} />
        )}

        <RejectCancelDialog
          data={openRejectCancelDialog as CancelRejectProps | null}
          open={!!openRejectCancelDialog}
          onClose={() => setRejectCancelDialog(false)}
        />

        {openGovDialog && (
          <GovDialog
            open={openGovDialog}
            onClose={() => setGovDialog(false)}
            myUID={uid}
            verified={isVerified}
            rejectedReasonAfter={rejectedReasonAfter}
          />
        )} */}
    </Box>
  );
};

export default Chat;
