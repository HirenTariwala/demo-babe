import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useUserStore } from '@/store/reducers/usersReducer';
import { LockEnum, lockChat } from '@/utility/CloudFunctionTrigger';
import { IconButton } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import UnlockChatDialog from '../Dialog/UnlockChatDialog';
import UnVerifiedModal from '@/components/page/Wallet/components/Withdrawn/UnVerifiedModal';
import Toast from '@/components/molecules/toast';
import Typography from '@/components/atoms/typography';
import Input from '@/components/atoms/input';
import SendIcon from '@/components/atoms/icons/sendIcon';

interface IInputBar {
  senderUUID: string | undefined;
  chatRoomId: string | undefined;
  requestNewOrder: () => void;
  myBlock: boolean;
  disabled: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  inputValue?: string | number | readonly string[] | undefined;
  sendMessage?: () => void;
  onInput?: (e: any) => void;
  unBlockClick?: () => void;
  onFocus?: () => void;
}

const InputBar = ({
  senderUUID,
  chatRoomId,
  requestNewOrder,
  myBlock,
  disabled: isDisable,
  onChange,
  onKeyUp,
  inputValue: value,
  sendMessage,
  onInput,
  unBlockClick,
  onFocus,
}: IInputBar) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openUnlockDialog, setOpenUnlockDialog] = useState<boolean>(false);
  const [openGovDialog, setGovDialog] = useState<boolean>(false);
  const { currentUser } = useUserStore();
  const [myUUID, isAdmin, isVerified, rejectedReasonAfter] = [
    currentUser?.uid,
    currentUser?.isAdmin,
    currentUser?.verified,
    currentUser?.rejectedReasonAfter,
  ];
  const [size] = useWindowSize();
  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const onCloseToast = () => {
    setOpenToast(false);
  };
  const onOpenToastWithMsg = (msg: string) => {
    setToastMsg(msg);
    setOpenToast(true);
  };

  const showUnlockButton = isAdmin && myUUID !== senderUUID;

  if (myBlock)
    return (
      <Box id="msger-inputarea-wrapper">
        <Box width="100%" height={100} display="flex" borderRadius={3} justifyContent="center" alignItems="center">
          <Button variant="text" color="secondary" onClick={unBlockClick}>
            Unblock
          </Button>
        </Box>
      </Box>
    );

  const unlockOnClick = () => {
    if (!isVerified) {
      setGovDialog(true);
      return;
    }

    setOpenUnlockDialog(true);
  };

  const lockClick = async () => {
    if (!chatRoomId || isLoading) {
      return;
    }
    setLoading(true);
    await lockChat(chatRoomId, LockEnum?.LOCKED);
    setLoading(false);
  };

  return (
    <Box>
      <Toast alertMessage={toastMsg} onClose={onCloseToast} open={openToast} />
      <Box
        id="msger-inputarea-wrapper"
        sx={
          {
            //   padding: '20px',
          }
        }
      >
        {!isDisable ? (
          <>
            <Box display="flex" justifyContent="space-between" p={5} gap={3} alignItems="center">
              <Input
                id="msger-input"
                multiline
                fullWidth
                sx={{
                  padding: 0,
                  '.MuiOutlinedInput-root': {
                    padding: '12px 16px',
                  },
                  '.MuiOutlinedInput-input': {
                    height: '24px !important',
                  },
                }}
                autoFocus={size?.width > 600}
                onChange={
                  isDisable
                    ? undefined
                    : (e: ChangeEvent<HTMLTextAreaElement>) => {
                        onChange?.(e);
                        onFocus?.();
                      }
                }
              />
              <IconButton sx={{ bgcolor: '#FFD443', height: 48, width: 48 }} disabled={isDisable} onClick={sendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
            {/* {showUnlockButton && (
              <>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Button
                    onClick={lockClick}
                    variant="contained"
                    color="error"
                    disabled={isLoading}
                    sx={{ minWidth: 60, maxWidth: 600, minHeight: '32px', maxHeight: '32px' }}
                  >
                    {isLoading ? <LoadingIcon /> : `Lock`}
                  </Button>
                </Box>
              </>
            )} */}
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            width="100%"
            gap={'16px'}
            padding={'20px'}
          >
            <Typography variant="caption" component="span">
              We only issue refund within 72 hours from the date of purchase
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
              <Button
                // fullWidth={!showUnlockButton}

                sx={{ borderRadius: '100px', width: 'fit-content' }}
                onClick={requestNewOrder}
                variant="contained"
                color="primary"
              >
                {'Request an Order'}
              </Button>

              {showUnlockButton && (
                <>
                  <Button
                    onClick={unlockOnClick}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 999999, maxWidth: 600 }}
                  >
                    {' '}
                    {'Unlock chat'}{' '}
                  </Button>
                </>
              )}
            </Box>

            {/* <RefundHint /> */}
          </Box>
        )}
      </Box>

      {chatRoomId && (
        <UnlockChatDialog open={openUnlockDialog} chatRoomId={chatRoomId} onClose={() => setOpenUnlockDialog(false)} />
      )}

      {openGovDialog && (
        <UnVerifiedModal
          open={openGovDialog}
          onClose={() => setGovDialog(false)}
          myUID={myUUID}
          verified={isVerified}
          rejectedReasonAfter={rejectedReasonAfter}
          onOpenToastWithMsg={onOpenToastWithMsg}
        />
      )}
    </Box>
  );
};

export default InputBar;
