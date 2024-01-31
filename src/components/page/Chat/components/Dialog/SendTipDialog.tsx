import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import CheckBox from '@/components/atoms/checkbox';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import Toast from '@/components/molecules/toast';
import { functions } from '@/credentials/firebase';
import { tipUserFunction } from '@/keys/functionNames';
import { useUserStore } from '@/store/reducers/usersReducer';
import { DialogProps } from '@mui/material';
import { httpsCallable } from 'firebase/functions';
import { ChangeEvent, useState } from 'react';

interface ISendTipDialog extends DialogProps {
  chatRoomId: string;
  onClose: () => void;
  open: boolean;
}

const SendTipDialog = ({ chatRoomId, open, onClose, ...props }: ISendTipDialog) => {
  const { currentUser } = useUserStore();

  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);

  const [openSnack, setSnack] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const sendTipHandler = async () => {
    if (!amount || loading || !currentUser?.uid) return;

    const tipUser = httpsCallable(functions, tipUserFunction);

    try {
      setLoading(true);
      setError(undefined);
      const res = await tipUser({
        uid: currentUser.uid,
        chatRoomId: chatRoomId,
        amount: amount * 100,
      });

      const data = res?.data as any;
      const status = data?.status;

      if (status !== 200) {
        const msg = data?.message;
        setError(msg);
      } else {
        setSnack(true);
        onClose();
      }

      setLoading(false);
    } catch (error) {
      console.log('Send Tip Handler Error ==> ', error);

      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = event?.target?.value;
    const amt = v ? parseFloat(v) : undefined;
    setAmount(amt);
  };

  const onChangeCheck = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setCheck(checked);
  };

  return (
    <>
      <Dialog
        open={open}
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
        fullWidth
        {...props}
        footer={
          <>
            <Button color="primary" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!check || !amount}
              loading={loading}
              color="primary"
              variant="contained"
              onClick={sendTipHandler}
            >
              Send
            </Button>
          </>
        }
      >
        <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
          Send {currentUser?.nickname} a Tip
        </Typography>

        <Box
          sx={{
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {error && (
            <Typography color="error" variant="body2" component="span">
              {error}
            </Typography>
          )}

          <Input fullWidth color="secondary" type="number" placeholder="Enter Credit amount" onChange={handleChange} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckBox
              onChange={onChangeCheck}
              color="primary"
              label={
                <Typography color="error" variant="caption">
                  I acknowledge that this is not refundable
                </Typography>
              }
            />
          </Box>
        </Box>
      </Dialog>

      <Toast
        alertMessage="Transaction success"
        onClose={() => {
          setSnack(false);
        }}
        open={openSnack}
      />
    </>
  );
};

export default SendTipDialog;
