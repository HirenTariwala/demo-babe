import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import DragUpload from '@/components/molecules/upload/dragupload';
import React from 'react';
import useWithdrawnHook from './useWithdrawnHook';
import ImageFrameIcon from '@/components/atoms/icons/imageFrameIcon';
import NextImage from '@/components/atoms/image';
import CheckBox from '@/components/atoms/checkbox';

interface IFooter {
  isOpen: boolean;
  withdrawModalChanges: () => void;
  isVerified: boolean;
}

const Withdrawn = ({ isOpen, isVerified, withdrawModalChanges }: IFooter) => {
  const { unVerifiedObj, setUnVerifiedObjChange, setIsDisable, WithdrawnFooter } = useWithdrawnHook({
    isVerified,
    withdrawModalChanges,
  });

  return (
    <Dialog
      open={isOpen}
      onClose={withdrawModalChanges}
      footer={WithdrawnFooter}
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
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
          {' '}
          {isVerified ? 'Withdraw' : 'Upload ID'}
        </Typography>
        {isVerified ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Typography variant="body2" color="#767676">
              According to Terms of Service, RentBabe platform will charge 25% of the withdraw amount as commission fee.
            </Typography>
            <Typography variant="body2" color="#646464">
              You will also pay a withdraw fee for <strong>S$0.29/time</strong>. You can withdraw up to{' '}
              <strong>500 Credit</strong> at one time.{' '}
              <strong>Withdrawals will normally arrive within/after 24 hours.</strong>
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="#646464" component={'span'}>
            Take a clear selfie of you holding your government issued ID (driving license, passport, etc...). You may
            censor any sensitive information on the document except for date of birth and face photo.
          </Typography>
        )}
        {isVerified ? (
          <Box></Box>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', gap: '12px', padding: '8px 0px' }}>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'} flex={'1 0 0'}>
              <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
                Front ID
              </Typography>
              <DragUpload
                name="frontid"
                icon={<ImageFrameIcon />}
                isImageViewAuto={false}
                setImage={(e) => {
                  setUnVerifiedObjChange({
                    ...unVerifiedObj,
                    frontId: e,
                  });
                }}
              />
              {unVerifiedObj?.frontId && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <NextImage
                    src={URL.createObjectURL(unVerifiedObj?.frontId)}
                    width={50}
                    height={50}
                    style={{
                      borderRadius: '12px',
                    }}
                    alt="file"
                  />
                  <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
                    {unVerifiedObj?.frontId?.name}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={'8px'} flex={'1 0 0'}>
              <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
                Back ID
              </Typography>
              <DragUpload
                name="backid"
                icon={<ImageFrameIcon />}
                isImageViewAuto={false}
                setImage={(e) => {
                  setUnVerifiedObjChange({
                    ...unVerifiedObj,
                    backId: e,
                  });
                }}
              />
              {unVerifiedObj?.backId && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <NextImage
                    src={URL.createObjectURL(unVerifiedObj?.backId)}
                    width={50}
                    height={50}
                    style={{
                      borderRadius: '12px',
                    }}
                    alt="file"
                  />
                  <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
                    {unVerifiedObj?.backId?.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        {isVerified ? (
          <Box></Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <CheckBox
              checked={unVerifiedObj?.isIUnderstand}
              onChange={(event) => {
                if (unVerifiedObj?.isIConsent && event?.target?.checked) {
                  setIsDisable(false);
                } else {
                  setIsDisable(true);
                }
                setUnVerifiedObjChange({
                  ...unVerifiedObj,
                  isIUnderstand: event?.target?.checked,
                });
              }}
              label={
                <Typography variant="body2" fontSize={'12px'} color="#646464" component={'span'}>
                  I understand that I was informed to censor off all sensitive information on the documents that I had
                  submitted except for <strong>date of birth and face photo.</strong>
                </Typography>
              }
            />
            <CheckBox
              checked={unVerifiedObj?.isIConsent}
              onChange={(event) => {
                if (event?.target?.checked && unVerifiedObj?.isIUnderstand) {
                  setIsDisable(false);
                } else {
                  setIsDisable(true);
                }
                setUnVerifiedObjChange({
                  ...unVerifiedObj,
                  isIConsent: event?.target?.checked,
                });
              }}
              label={
                <Typography variant="body2" fontSize={'12px'} color="#646464" component={'span'}>
                  I consent that the platform may collect, use and disclose my date of birth and face photo information
                  to verify my age and to prove my identity, in accordance with the Personal Data Protection Act 2012.{' '}
                </Typography>
              }
            />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default Withdrawn;
