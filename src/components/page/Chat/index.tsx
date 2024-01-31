'use client';
import Box from '@/components/atoms/box';
import ArrowForwardIcon from '@/components/atoms/icons/arrowForwardIcon';
import React from 'react';
import styles from './chat.module.css';
import Tabs from '@/components/atoms/tabs';
import useChatHook from './useChatHook';
import EmptyData from '@/components/molecules/EmptyData';
import EmptyBoxIcon from '@/components/atoms/icons/emptyBoxIcon';
// import Typography from '@/components/atoms/typography';
import ChatBox from './components/ChatBox';
import ChatMessageIcon from '@/components/atoms/icons/chatMessageIcon';
import LoadingIcon from '@/components/atoms/icons/loading';
import FolderDocumentIcon from '@/components/atoms/icons/folderDocumentIcon';
import { IconButton } from '@mui/material';

interface IChat {
  onDrawerClose?: () => void;
}

const Chat = ({ onDrawerClose }: IChat) => {
  const {
    isMobile,
    tabsData,
    dataConversation,
    errorChat,
    loadingChat,
    errorArchive,
    dataArchive,
    loadingArchive,
    chatUUID,
    activeTab,
    setActiveTab,
    router,
  } = useChatHook();

  if (loadingChat || errorChat || loadingArchive || errorArchive) {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100vh',
          minWidth: isMobile ? '100%' : '600px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            justifyContent: 'center',
          }}
        >
          <LoadingIcon />
        </Box>
      </Box>
    );
  }

  if (!(dataConversation?.size as number) && !(dataArchive?.size as number)) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box className={styles.backArrowHeader}>
          <IconButton
            // className={styles.backArrowButton}
            onClick={() => (onDrawerClose ? onDrawerClose() : '')}
            sx={{
              // transform: isMobile ? 'scaleX(-1)' : 'scaleX(1)',
              transform: 'scaleX(-1)',
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            flex: '1 0 0',
            display: 'flex',
            maxWidth: '600px',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <EmptyData icon={<EmptyBoxIcon />} msg="You have no messages yet" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.chatSection}>
      <Box className={styles.userListSection}>
        <Box className={styles.backArrowHeader}>
          <Box className={styles.backArrowButton} onClick={() => (onDrawerClose ? onDrawerClose() : router?.back())}>
            <ArrowForwardIcon />
          </Box>
        </Box>
        {dataConversation && (
          <Box className={styles.userList}>
            <Box>
              <Tabs
                onTabChange={(e: number | undefined) => setActiveTab(e || 0)}
                tabBottomPadding={4}
                mainClass={'main_tabs'}
                tabsData={tabsData}
              />
            </Box>
          </Box>
        )}
      </Box>
      {!isMobile &&
        (activeTab ? (
          <Box className={styles.chatBoxSection}>
            <Box height="80%" width="100%" minWidth="600px" display="flex" justifyContent="center" alignItems="center">
              <EmptyData icon={<FolderDocumentIcon />} msg="To read a conversation,<br/>please first retrieve it" />
            </Box>
          </Box>
        ) : (
          dataConversation && (
            <Box className={styles.chatBoxSection}>
              {chatUUID ? (
                <ChatBox loading={loadingChat} />
              ) : (
                <Box
                  height="80%"
                  width="100%"
                  minWidth="600px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <EmptyData icon={<ChatMessageIcon />} msg="Please select a conversation <br/>to view messages" />
                </Box>
              )}
            </Box>
          )
        ))}

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
