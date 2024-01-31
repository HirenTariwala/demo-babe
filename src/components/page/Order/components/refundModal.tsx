import React, { useEffect, useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import { TextareaAutosize } from '@mui/material';
import styles from '../order.module.css';
import Price from '@/components/molecules/price';
import NextImage from '@/components/atoms/image';
import DragUpload from '@/components/molecules/upload/dragupload';
import { useDocumentQuery } from '@/hooks/useDocumentQuery';
import { doc } from 'firebase/firestore';
import { db, functions, storage } from '@/credentials/firebase';
import { MESSAGES, CONVERSATION, ORDER, contentKey, rejectReasonKey, statusKey } from '@/keys/firestoreKeys';
import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { requestRefundFunction, sendTelegramNotificationFunction } from '@/keys/functionNames';
import { OrderStatusEnum } from '@/enum/orderEnum';

// dayjs.extend(customParseFormat);

const formatTimeWithBookedSlot = (from: string, to: string) => {
  const format = 'YYYY-MM-DD h:mm A';
  const fromT = dayjs(`2000-01-01 ${from}`, { format });
  const toT = dayjs(`2000-01-01 ${to}`, {
    format,
  });
  const diff = toT?.diff(fromT, 'minutes');
  return diff;
};
interface IRefundOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  orderId: string | undefined;
  orderDetails: any;
  myUid: string | undefined | null;
  setOpen: (arg: boolean) => void | undefined;
  setIsOpenRefundRequestSubmittedDialog?: (arg: boolean) => void;
}

const RefundModal = ({
  isMobile,
  isTablet,
  isOpen,
  orderId,
  orderDetails,
  myUid,
  // setIsOpenRefundRequestSubmittedDialog,
  setOpen,
}: IRefundOrderModal) => {
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<(File | string)[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const { service, details } = orderDetails;
  const { data: orderData } = useDocumentQuery(`order-data-${orderId}`, orderId ? doc(db, ORDER, orderId) : undefined);
  const { data: messageData } = useDocumentQuery(
    details?.chatRoomId && details?.messageID ? `order-data-${orderId}` : '',
    details?.chatRoomId && details?.messageID
      ? doc(db, CONVERSATION, details?.chatRoomId, MESSAGES, details?.messageID)
      : undefined
  );
  const onChangeHandle = (files: File | undefined) => {
    if (files !== null && files) {
      setFile([...file, files]);
    }
  };
  const status = orderData?.data()?.[statusKey];
  const rejectReason = orderData?.get(rejectReasonKey)?.[myUid ?? '']?.n;
  const rejectEvidence = orderData?.get(rejectReasonKey)?.[myUid ?? '']?.u;

  useEffect(() => {
    if (!reason && rejectReason) {
      setReason(rejectReason);
      setFile(typeof rejectEvidence === 'string' ? [rejectEvidence] : rejectEvidence);
    }
  }, [orderData]);

  const msg = messageData?.get(contentKey) as string;
  const timeString = msg?.split('\n')[2]?.split(': ')[1];
  const twoTime = timeString?.split('-');

  const timeFormat = formatTimeWithBookedSlot(twoTime?.[0]?.trim(), twoTime?.[1]?.trim());
  let newTimeFormat = 'Game';
  if (service?.suffix === 1) {
    const hour = (timeFormat / 60)?.toFixed(2);

    newTimeFormat = `${hour}Hr`;
  } else if (service?.suffix === 0) {
    newTimeFormat = `${timeFormat}Min`;
  }

  const onSubmitHandler = async (e: any) => {
    // eslint-disable-next-line no-debugger
    debugger;
    e.preventDefault();
    if (!file || !reason || !myUid) return;
    if (loadingSubmit) return;
    setLoadingSubmit(true);
    const promises: Promise<string>[] = [];
    file.map((photo) => {
      const uploadImageRef = ref(storage, `REPORT/REFUND/${orderId}/${new Date().getTime()}-${(photo as File).name}`);
      promises?.push(
        uploadBytes(uploadImageRef, photo as File)?.then((uploadTask) => {
          return getDownloadURL(uploadTask.ref);
        })
      );
    });
    const photos = await Promise.all(promises);
    try {
      try {
        const sendTelegramMessage = httpsCallable(functions, sendTelegramNotificationFunction);
        sendTelegramMessage({
          tele_id: '858353262',
          text: encodeURIComponent(`Refund request: ${orderId}`),
        });
      } catch (err) {
        console.log('error', err);
      }
      const requestRefund = httpsCallable(functions, requestRefundFunction);
      await requestRefund({
        id: orderId,
        url: photos ?? [],
        reason: reason,
      });
      setLoadingSubmit(false);
      // setIsOpenRefundRequestSubmittedDialog(true);
    } catch (error) {
      // openAlert(`${error}`.replace("FirebaseError: ", ""))
    }
  };

  const imageCheck = (src: string | Blob) => {
    return src instanceof Blob ? URL.createObjectURL(src) : src;
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={() => setOpen(false)}
        footer={
          <Box
            sx={
              isMobile
                ? {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    width: '100%',
                    gap: 3,
                  }
                : {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 3,
                  }
            }
          >
            <Button
              variant="outlined"
              sx={{
                padding: '12px 20px',
                width: '100%',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              disabled={!reason || !file}
              loading={loadingSubmit}
              sx={{
                padding: '12px 20px',
                width: '100%',
                whiteSpace: 'nowrap',
              }}
              onClick={(e) => onSubmitHandler(e)}
            >
              {status === OrderStatusEnum.pending_refund ? 'Update' : 'Submit'}
            </Button>
          </Box>
        }
        sx={{
          '.MuiPaper-root': {
            borderRadius: '24px',
            width: isMobile ? '100%' : isTablet ? '800px' : '1000px',
          },
          '.MuiDialogContent-root': {
            position: 'relative',
            padding: '24px',
          },
          '.MuiDialogActions-root': {
            padding: '24px',
          },
          '.MuiDialog-paper': {
            margin: isMobile ? '16px' : '32px',
          },
        }}
        open={isOpen}
      >
        <Box display="flex" flexDirection="column" gap={5}>
          <Typography variant="h3" fontWeight={500}>
            {status === OrderStatusEnum.pending_refund ? 'Update refund request' : 'Refund'}
          </Typography>
          <Typography variant="body1" color="#646464">
            Please issue refund within 72 hours. You may update your refund request by re-submitting it.
          </Typography>
          <Box display="flex" gap={3} justifyContent="space-between">
            <Box display="flex" gap={3} width="100%">
              <NextImage src={service?.image || ''} alt={'image'} width={80} height={80} style={{ borderRadius: 12 }} />
              <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent={isMobile ? 'flex-start' : 'space-between'}
                gap={3}
                width="-webkit-fill-available"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="h5" component="span">
                    {service?.title}
                  </Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar avatars={[{ alt: 'H', src: details?.profile }]} sx={{ width: 24, height: 24 }} />
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="subtitle2" fontWeight={500} color="#646464">
                        {details?.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Price
                  priceData={{
                    price: details?.price || 0,
                    min: details?.price || 0,
                    max: details?.price || 0,
                    hr: newTimeFormat,
                  }}
                  category="1"
                />
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              Refund reason
            </Typography>
            <TextareaAutosize
              value={reason}
              placeholder="Refund reason"
              className={styles.textArea}
              onChange={(e) => setReason(e.target.value)}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              Photo evidence
            </Typography>
            <DragUpload name="frontid" isImageViewAuto={false} setImage={onChangeHandle} />
            {file &&
              file.length > 0 &&
              file?.map((item, index) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                    key={index}
                  >
                    <NextImage
                      src={imageCheck(item)}
                      width={50}
                      height={50}
                      style={{
                        borderRadius: '12px',
                      }}
                      alt="file"
                    />
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default RefundModal;
