import Button from '@/components/atoms/button';
import LoadingIcon from '@/components/atoms/icons/loading';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import { LockEnum, lockChat } from '@/utility/CloudFunctionTrigger';
import { DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';
import { useState } from 'react';

interface IUnlockChatDialog extends DialogProps {
  chatRoomId: string;
}

const UnlockChatDialog = ({ chatRoomId, ...props }: IUnlockChatDialog) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const onLock = async (e: any) => {
    setLoading(true);
    await lockChat(chatRoomId, LockEnum?.UNLOCKED);
    setLoading(false);
    props?.onClose?.(e, 'backdropClick');
  };

  return (
    <Dialog
      {...props}
      footer={
        <>
          <Button variant="contained" color="inherit" onClick={(e) => props?.onClose?.(e, 'backdropClick')}>
            {'Cancel'}
          </Button>
          <Button
            onClick={onLock}
            disabled={isLoading}
            variant="contained"
            color="error"
            endIcon={isLoading && <LoadingIcon size={12} />}
          >
            {'Unlock'}
          </Button>
        </>
      }
    >
      <DialogTitle>{'Unlock chat'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            'By default, all chats are locked to prevent unnecessary chatting. Unlocking a chat might prevent you from getting paid for certain services such as E-Meets.'
          }
          <br />
          <br />
          {'You can always lock or unlock a chat when necessary.'}
        </DialogContentText>
      </DialogContent>

      <DialogContent>
        <Typography variant="caption" color="error">
          {'We ban user who conduct NSFW services or gives out third party messenger (off-platform transaction)'}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default UnlockChatDialog;
