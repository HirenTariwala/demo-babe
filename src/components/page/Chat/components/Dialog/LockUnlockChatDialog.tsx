import Alert from '@/components/atoms/alert';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import { lockChat } from '@/utility/CloudFunctionTrigger';
import React, { useState } from 'react';

interface ILockUnlockChatDialog {
  isOpen: boolean;
  chatRoomID: string;
  onCloseHandler: () => void;
  revalidate: () => void;
}
const LockUnlockChatDialog = ({ isOpen, chatRoomID, onCloseHandler, revalidate, ...props }: ILockUnlockChatDialog) => {
  const [loading, setLoading] = useState(false);

  const onLockChat = async () => {
    if (!chatRoomID) return;

    setLoading(true);

    try {
      await lockChat(chatRoomID);
      // Successfully locked the chat
    } catch (error) {
      console.log('chat Lock-Unlock Error==> ', error);

      // error occur;
    } finally {
      revalidate();
      onCloseHandler();
      setLoading(false);
    }
  };
  return (
    <Dialog
      sx={{
        '.MuiPaper-root': {
          borderRadius: '24px',
        },
        '.MuiDialogContent-root': {
          padding: '24px',
        },
        '.MuiDialogActions-root': {
          padding: '24px',
        },
      }}
      open={isOpen}
      fullWidth
      {...props}
      footer={
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <Button color="primary" variant="outlined" onClick={onCloseHandler}>
            Cancel
          </Button>
          <Button color="error" variant="contained" loading={loading} onClick={onLockChat}>
            Unlock
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
          Unlock chat
        </Typography>
        <Typography color="#646464" variant="body1" component="span">
          By default, all chats are locked to prevent unnecessary chatting. Unlocking a chat might prevent you from
          getting paid for certain services such as E-Meets.
        </Typography>
        <Typography color="#646464" variant="body1" component="span">
          You can always lock or unlock a chat when necessary.
        </Typography>
        <Alert
          icon={false}
          severity="error"
          sx={{
            borderRadius: '12px !important',
            width: '100%',
            padding: '8px 12px',
          }}
        >
          <Typography variant="body2" component="span">
            We ban user who conduct NSFW services or gives out third party messenger (off-platform transaction)
          </Typography>
        </Alert>
      </Box>
    </Dialog>
  );
};

export default LockUnlockChatDialog;
