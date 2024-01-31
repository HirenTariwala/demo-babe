import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import { db, functions } from '@/credentials/firebase';
import { CancelOrRejectEnum, option } from '@/enum/myEnum';
import { OrderStatusEnum } from '@/enum/orderEnum';
import { emailExp, phoneExp } from '@/keys/Regex';
import { messenger, nsfw, payment, sendTelegramNotificationToAdmin } from '@/keys/filters';
import {
  CONVERSATION,
  MESSAGES,
  ORDER,
  lastMessageKey,
  rejectReasonKey,
  statusKey,
  timeStampKey,
  updatedAtKey,
} from '@/keys/firestoreKeys';
import { sendPushNotificationFunction, sendTelegramNotificationFunction } from '@/keys/functionNames';
import { CancelRejectProps } from '@/props/commonProps';
import { useUserStore } from '@/store/reducers/usersReducer';
import { Helper } from '@/utility/helper';
import { DialogProps } from '@mui/material';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';

interface IRejectCancelDialog extends DialogProps {
  data: CancelRejectProps | null;
}

const RejectCancelDialog = ({ data, ...props }: IRejectCancelDialog) => {
  const chatRoomId = data?.cri;
  const messageId = data?.mid;

  const { currentUser } = useUserStore();
  const [myNickname, teleId, APNSToken, myProfileImage] = [
    currentUser?.nickname || currentUser?.nick,
    currentUser?.teleId,
    currentUser?.APNSToken,
    currentUser?.profileImage,
  ];

  const [reason, setReason] = useState('');
  const [hasError, setError] = useState(false);

  const onConfirm = async () => {
    if (!reason) {
      setError(true);
      return;
    }

    if (!chatRoomId || !messageId) {
      return;
    }

    let promises = [];

    // filter reason
    const censor = '****';
    const reasonMsg = reason?.replace(phoneExp, censor).replace(emailExp, censor);
    const action = data?.st === CancelOrRejectEnum.CANCEL ? 'cancel' : 'rejected';

    let msg = `${myNickname} has ${action} your order.`;
    msg += reasonMsg ? ` Reason:\n\n${reasonMsg}` : '';

    let batch = writeBatch(db);

    batch.update(doc(db, CONVERSATION, chatRoomId, MESSAGES, messageId), {
      [statusKey]: option.reject,
      [rejectReasonKey]: msg,
    });

    batch.update(doc(db, CONVERSATION, chatRoomId), {
      [updatedAtKey]: serverTimestamp(),
      [lastMessageKey]: `Order ${action}`,
    });

    const orderId = data?.plink ? data?.plink?.split('id=')[1] : '';

    if (orderId) {
      batch.update(doc(db, ORDER, orderId), {
        [timeStampKey]: serverTimestamp(),
        [statusKey]: OrderStatusEnum.cancel,
      });
    }

    promises.push(batch.commit());

    const promise = sendTelegramNotification(msg);
    if (promise) {
      promises.push(promise);
    }

    const fcm = sendPushNotification(msg);
    if (fcm) {
      promises.push(fcm);
    }

    const warning = checkForThirdParty(msg);
    if (warning) {
      promises.push(warning);
    }

    //setLoading(true)
    setError(false);

    Promise.all(promises);
    props.onClose?.({}, 'backdropClick');
    //setLoading(false)
  };

  const checkForThirdParty = (content: string | undefined): Promise<void> | undefined => {
    if (!content) {
      return undefined;
    }

    const filter = content.replace(/[^a-zA-Z ]/g, '').toLowerCase();

    let selected = '';

    if (
      payment.some((word) => {
        selected = word;
        return filter.includes(word);
      })
    ) {
      const chatLink = `${window.location.origin}/chatview?cri=${chatRoomId}`;
      return sendTelegramNotificationToAdmin(`${chatLink} doing off-platform transaction [${selected}]\n\n${filter}`);
    } else if (
      messenger.some((word) => {
        selected = word;
        return filter.includes(word);
      })
    ) {
      const chatLink = `${window.location.origin}/chatview?cri=${chatRoomId}`;
      return sendTelegramNotificationToAdmin(`${chatLink} doing off-platform messaging [${selected}]\n\n${filter}`);
    } else if (
      nsfw.some((word) => {
        selected = word;
        return filter.includes(word);
      })
    ) {
      const chatLink = `${window.location.origin}/chatview?cri=${chatRoomId}`;
      return sendTelegramNotificationToAdmin(`${chatLink} doing NSFW request [${selected}\n\n${filter}]`);
    }

    return undefined;
  };

  const sendPushNotification = (body: string | null | undefined): Promise<any> | undefined => {
    if (APNSToken) {
      const sendPushNotification = httpsCallable(functions, sendPushNotificationFunction);
      return sendPushNotification({
        token: APNSToken,
        title: myNickname ?? 'User',
        body: body ?? '',
        icon: myProfileImage ?? '',
      });
    }

    return undefined;
  };

  const sendTelegramNotification = (text: string): Promise<any> | undefined => {
    if (teleId) {
      const sendTelegramNotification = httpsCallable(functions, sendTelegramNotificationFunction);
      const _text = encodeURIComponent(text);

      return sendTelegramNotification({
        tele_id: teleId,
        text: _text,
      });
    }
    return undefined;
  };

  if (!data) return null;
  else
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
        fullWidth
        {...props}
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button color="primary" variant="outlined" onClick={(e) => props.onClose?.(e, 'backdropClick')}>
              Cancel
            </Button>
            <Button color="error" disabled={!reason} variant="contained" onClick={onConfirm}>
              Confirm
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
          {/* <DialogTitle>{data.st === CancelOrReject.CANCEL ? t('cancel.reason') : t('rejected.reason')}</DialogTitle> */}
          <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
            {data?.st === CancelOrRejectEnum.CANCEL ? 'Cancel request' : 'Rejected request'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: ' 8px',
            }}
          >
            <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
              {data?.st === CancelOrRejectEnum.CANCEL ? 'Cancel Reason' : 'Rejected Reason'}
            </Typography>
            <Input
              autoFocus
              // margin="dense"
              onFocus={() => {
                setTimeout(() => {
                  window.scrollTo(0, 100);
                }, 100);
              }}
              sx={{
                '.MuiInputBase-root': {
                  borderRadius: '12px',
                  padding: '12px 16px',
                },
              }}
              fullWidth
              color="secondary"
              multiline
              rows={3}
              maxRows={3}
              error={hasError}
              placeholder="Enter your reason"
              // helperText={hasError && 'Please write a reason'}
              onChange={(e) => {
                //setCounter(0)
                const value = e.currentTarget.value;
                setReason(value);
              }}
            />
          </Box>
        </Box>
      </Dialog>
    );
};

export default RejectCancelDialog;
