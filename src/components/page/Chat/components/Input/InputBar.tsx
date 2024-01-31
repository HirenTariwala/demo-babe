import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useUserStore } from '@/store/reducers/usersReducer';
import { IconButton } from '@mui/material';
import { ChangeEvent } from 'react';
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
  sendMessage?: () => void;
  unBlockClick?: () => void;
  onFocus?: () => void;
  openUnVerifiedModalHandler: () => void;
  onLockChat: () => void;
  lockUnlockChatLoading: boolean;
}

const InputBar = ({
  senderUUID,
  requestNewOrder,
  myBlock,
  disabled: isDisable,
  onChange,
  sendMessage,
  unBlockClick,
  onFocus,
  onLockChat,
  lockUnlockChatLoading,
}: IInputBar) => {
  const { currentUser } = useUserStore();
  const [
    myUUID,
    isAdmin,
    // isVerified, rejectedReasonAfter
  ] = [
    currentUser?.uid,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentUser?.isAdmin || currentUser?.a,
    // currentUser?.verified,
    // currentUser?.rejectedReasonAfter,
  ];
  const [size] = useWindowSize();

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

  return (
    <Box>
      <Box id="msger-inputarea-wrapper">
        {!isDisable ? (
          <>
            <Box display="flex" justifyContent="space-between" padding="0px 20px 20px 20px" gap={3} alignItems="center">
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
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" gap="12px">
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
                <Button
                  onClick={onLockChat}
                  variant="outlined"
                  color="error"
                  loading={lockUnlockChatLoading}
                  sx={{ borderRadius: 999999, maxWidth: 600 }}
                >
                  {' '}
                  {'Unlock chat'}{' '}
                </Button>
              )}
            </Box>

            {/* <RefundHint /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InputBar;
