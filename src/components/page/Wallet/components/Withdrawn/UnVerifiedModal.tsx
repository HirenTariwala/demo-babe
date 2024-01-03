import Alert from '@/components/atoms/alert';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import CheckBox from '@/components/atoms/checkbox';
import ImageFrameIcon from '@/components/atoms/icons/imageFrameIcon';
import NextImage from '@/components/atoms/image';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import DragUpload from '@/components/molecules/upload/dragupload';
import { db, storage } from '@/credentials/firebase';
import {
  USERS,
  VERIFY,
  rejectReasonAfterKey,
  timeStampKey,
  uidKey,
  urlsKey,
  videoVerificationKey,
} from '@/keys/firestoreKeys';
import { VERIFICATION } from '@/keys/storageKeys';
import { DialogContentText, DialogProps } from '@mui/material';
import { deleteField, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { ChangeEvent, useState } from 'react';

interface IUnVerifiedModal extends DialogProps {
  myUID: string | null | undefined;
  verified: boolean | undefined;
  rejectedReasonAfter: string | null | undefined;
  open: boolean;
  onClose: () => void;
  onOpenToastWithMsg: (msg: string) => void;
}

interface InputProps {
  // onChangeHandleFront: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onChangeHandleBack: (e: React.ChangeEvent<HTMLInputElement>) => void;
  frontFile: File | undefined;
  backFile: File | undefined;
  onChangeHandleFront: (e: File | undefined) => void;
  onChangeHandleBack: (e: File | undefined) => void;
}

const UploadFrontBackInput = ({ frontFile, backFile, onChangeHandleFront, onChangeHandleBack }: InputProps) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '8px 0px' }}>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'} flex={'1 0 0'}>
        <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
          Front ID
        </Typography>
        <DragUpload name="frontid" icon={<ImageFrameIcon />} isImageViewAuto={false} setImage={onChangeHandleFront} />
        {frontFile && (
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <NextImage
              src={URL.createObjectURL(frontFile)}
              width={50}
              height={50}
              style={{
                borderRadius: '12px',
              }}
              alt="file"
            />
            <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
              {frontFile?.name}
            </Typography>
          </Box>
        )}
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'} flex={'1 0 0'}>
        <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
          Back ID
        </Typography>
        <DragUpload name="backid" icon={<ImageFrameIcon />} isImageViewAuto={false} setImage={onChangeHandleBack} />
        {backFile && (
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <NextImage
              src={URL.createObjectURL(backFile)}
              width={50}
              height={50}
              style={{
                borderRadius: '12px',
              }}
              alt="file"
            />
            <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
              {backFile?.name}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const UnVerifiedModal = ({
  myUID: uid,
  verified,
  rejectedReasonAfter,
  open,
  onClose,
  onOpenToastWithMsg,
  ...props
}: IUnVerifiedModal) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const [firstCheck, setFirstCheck] = useState<boolean>(false);
  const [secondCheck, setSecondCheck] = useState<boolean>(false);

  const [frontFile, setFrontFile] = useState<File | undefined>();

  const [backFile, setBackFile] = useState<File | undefined>();

  const [msg, setMsg] = useState<string>();
  const [openSnackBar, setSnackBar] = useState<boolean>(false);

  const [indicator, setIndicator] = useState<string>('');

  const onCloseSnackbar = () => {
    setSnackBar(false);
  };

  const openSB = (message: string) => {
    setMsg(message);
    setSnackBar(true);
  };
  const handleModalClose = () => {
    setFirstCheck(false);
    setSecondCheck(false);
    setFrontFile(undefined);
    setBackFile(undefined);
    onClose();
  };

  const onSubmitHandle = async (e: { preventDefault: () => void }) => {
    onCloseSnackbar();
    e.preventDefault();

    if (!uid) return;

    if (!frontFile) {
      openSB('Please upload front photo');
      return;
    }

    if (!backFile) {
      openSB('Please upload back photo');
      return;
    }

    const num = 8;
    const fileSize = 1048576 * num;

    if (frontFile?.size > fileSize || backFile?.size > fileSize) {
      // 1 MiB for bytes.
      openSB(`File size too big (max ${num}MB)`);
      return;
    }

    setLoading(true);

    const upload = async (file: File) => {
      const uploadImageRef = ref(storage, `${VERIFICATION}/${uid}/${Date.now()}-${file.name}`);
      const uploadTask = await uploadBytes(uploadImageRef, file);
      const url = await getDownloadURL(uploadTask.ref);

      return `${url}&t=${Date.now()}`;
    };

    try {
      setIndicator('Please wait, uploading images...');

      const urls = await Promise.all([upload(frontFile), upload(backFile)]);

      const batch = writeBatch(db);

      batch.set(
        doc(db, VERIFY, uid),
        {
          [urlsKey]: urls,
          [timeStampKey]: serverTimestamp(),
          [uidKey]: uid,
          [videoVerificationKey]: false,
        },
        { merge: true }
      );

      batch.update(doc(db, USERS, uid), {
        [rejectReasonAfterKey]: deleteField(),
        [videoVerificationKey]: false,
      });

      setIndicator('Almost done...');
      try {
        batch.commit();
      } catch (error) {
        console.log('Error Unvarified Catch => ', error);
        // error occur
      }

      onOpenToastWithMsg('Uploaded');
      handleModalClose();
      // openSB('Uploaded');
    } catch (error) {
      console.log('Error Unvarified Catch ===> ', error);

      openSB('Unexpected error');
    }

    setIndicator('');
    setLoading(false);
  };

  const onChangeHandleFront = (files: File | undefined) => {
    if (files !== null && files) {
      setFrontFile(files);
    }
  };

  const onChangeHandleBack = (files: File | undefined) => {
    if (files !== null && files) {
      setBackFile(files);
    }
  };

  const onFirstCheckChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFirstCheck(checked);
  };

  const onSecondCheckChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setSecondCheck(checked);
  };

  const footer = verified !== true && (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
      }}
    >
      <Button
        color="primary"
        onClick={handleModalClose}
        size="medium"
        startIcon={null}
        sx={{
          borderRadius: 50,
          fontSize: '16px',
          fontWeight: 700,
          padding: '12px 20px',
          textTransform: 'none',
        }}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        color="primary"
        size="medium"
        startIcon={null}
        loading={isLoading}
        sx={{
          borderRadius: 50,
          fontSize: '16px',
          fontWeight: 700,
          padding: '12px 20px',
          textTransform: 'none',
        }}
        // disabled={isLoading ? true : verified === false ? false : !(secondCheck && firstCheck)}
        disabled={!(secondCheck && firstCheck)}
        variant="contained"
        type="submit"
        onClick={onSubmitHandle}
      >
        {/* {verified === false ? 'Update' : 'Submit'} */}
        Done
      </Button>
    </Box>
  );

  return (
    <>
      {/* <CenterSnackBar open={openSnackBar} message={msg} autoHideDuration={1500} onClose={onCloseSnackbar} /> */}
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
        footer={footer}
        fullWidth
        {...props}
        open={open}
        onClose={onClose}
      >
        <form
          // onSubmit={onSubmitHandle}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {openSnackBar && (
            <Alert color="warning" onClose={onCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
              {msg}
            </Alert>
          )}
          <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
            {/* {verified === false ? 'Waiting for approval' : verified ? 'Approved' : `Upload`} */}
            {`Upload ID`}
          </Typography>

          {rejectedReasonAfter && (
            <DialogContentText variant="caption" color="error">
              {rejectedReasonAfter}
              <br />
            </DialogContentText>
          )}

          {verified === false ? (
            <>
              <Typography variant="body2" color="#646464" component={'span'}>
                <b>Our team will review your docuenmts within 24 hours.</b>
                <br />
                <br />
                You may resubmit your documents. You may censor any sensitive information on the document except for{' '}
                <b>date of birth and face photo</b>.
              </Typography>

              <UploadFrontBackInput
                frontFile={frontFile}
                backFile={backFile}
                onChangeHandleFront={onChangeHandleFront}
                onChangeHandleBack={onChangeHandleBack}
              />
            </>
          ) : (
            <>
              {verified !== true && (
                <>
                  <Typography variant="body2" color="#646464" component={'span'}>
                    Take a clear selfie of you holding your government issued ID (driving license, passport, etc...).
                    You may censor any sensitive information on the document except for date of birth and face photo.
                  </Typography>
                  <UploadFrontBackInput
                    frontFile={frontFile}
                    backFile={backFile}
                    onChangeHandleFront={onChangeHandleFront}
                    onChangeHandleBack={onChangeHandleBack}
                  />
                </>
              )}
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <CheckBox
              checked={firstCheck}
              onChange={onFirstCheckChange}
              label={
                <Typography variant="body2" fontSize={'12px'} color="#646464" component={'span'}>
                  I understand that I was informed to censor off all sensitive information on the documents that I had
                  submitted except for <strong>date of birth and face photo.</strong>
                </Typography>
              }
            />
            <CheckBox
              checked={secondCheck}
              onChange={onSecondCheckChange}
              label={
                <Typography variant="body2" fontSize={'12px'} color="#646464" component={'span'}>
                  I consent that the platform may collect, use and disclose my date of birth and face photo information
                  to verify my age and to prove my identity, in accordance with the Personal Data Protection Act 2012.{' '}
                </Typography>
              }
            />
          </Box>
          {/* <FormControlLabel
            
            labelPlacement="end"
            control={<CheckBox checked={firstCheck} onChange={onFirstCheckChange} color="secondary" />}
            label={
              <Typography color="text.secondary" fontSize={12}>
                I understand that I was informed to censor off all sensitive information on the documents that I had
                submitted except for <b>date of birth and face photo.</b>
              </Typography>
            }
          />

          <FormControlLabel
            
            labelPlacement="end"
            control={<CheckBox checked={secondCheck} onChange={onSecondCheckChange} color="secondary" />}
            label={
              <Typography color="text.secondary" fontSize={12}>
                I consent that the platform may collect, use and disclose my date of birth and face photo information to
                verify my age and to prove my identity, in accordance with the Personal Data Protection Act 2012.
              </Typography>
            }
          /> */}

          {/* {verified === undefined && (
          )} */}

          {indicator && (
            <Typography color="error" variant="caption">
              {indicator}
            </Typography>
          )}
        </form>
      </Dialog>
    </>
  );
};

export default UnVerifiedModal;
