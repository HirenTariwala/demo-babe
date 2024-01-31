import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import GreenTickIcon from '@/components/atoms/icons/greenTickIcon';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import { DialogProps, useMediaQuery } from '@mui/material';
import React from 'react';

interface IRefundRequestSubmittedModal extends DialogProps {
    setIsOpenRefundRequestSubmittedDialog:(arg:boolean) =>void
  }

const RefundRequestSubmittedModal = ({setIsOpenRefundRequestSubmittedDialog, ...props }:IRefundRequestSubmittedModal) => {
    const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Dialog
    onClose={()=> setIsOpenRefundRequestSubmittedDialog(false)}
      sx={{
        '.MuiPaper-root': {
          borderRadius: '24px',
          maxWidth: '448px',
          margin: isMobile ? '16px' : '32px',
        },
        '.MuiDialogContent-root': {
          padding: isMobile ? '24px 16px 16px 16px' : '24px',
        },
        '.MuiDialogActions-root': {
          padding: isMobile ? '16px' : '24px',
        },
      }}
      {...props}
      footer={
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Button variant="outlined" color="primary" onClick={() => setIsOpenRefundRequestSubmittedDialog(false)}>
            Close pop-up
          </Button>

          <Button variant="contained" color="primary" onClick={() => {}}>
            View request
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
        <Box textAlign="center">
          <GreenTickIcon size={60}/>
        </Box>
        <Typography variant="h3" fontWeight={500} color="#1A1A1A" component={'span'}>
          Your refund request has been submitted
        </Typography>
            <Typography variant="body2" color="#646464" component="span">
              Please wait for our review team to investigate the refund request. You may check on the status in the
              Order page
            </Typography>
      </Box>
    </Dialog>
  );
};

export default RefundRequestSubmittedModal;
