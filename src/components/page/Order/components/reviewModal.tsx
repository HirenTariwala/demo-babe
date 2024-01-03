import React, { useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import Rating from '@/components/molecules/ratings';
import { TextareaAutosize } from '@mui/material';
import styles from '../order.module.css';
import Toggle from '@/components/atoms/toggle';
import CheckBox from '@/components/atoms/checkbox';

interface IRequestOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  setOpen: (arg: boolean) => void | undefined;
}

const ReviewModal = ({ isMobile, isTablet, isOpen, setOpen }: IRequestOrderModal) => {
  const [description, setDescription] = useState('');
  const [check, setCheck] = useState<boolean>(false);
  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={() => setOpen(false)}
        footer={
          <Box display="flex" justifyContent={'flex-end'} gap={3} p={4}>
            <Button
              variant="outlined"
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              disabled
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => {}}
            >
              Submit
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
          },
          '.MuiDialogActions-root': {
            p: 'unset',
          },
        }}
        open={isOpen}
      >
        <Box display="flex" flexDirection="column" gap={5}>
          <Typography variant="h3" fontWeight={500}>
            Review {"name"}
          </Typography>
          <Typography variant="body1" color="#646464">
            The credits that you sent to the user will be transferred to their bank account immediately.
          </Typography>
          <Box display="flex" gap={3} justifyContent="center">
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" gap={2} alignItems="center" justifyContent="center">
                <Avatar avatars={[{ alt: 'H', src: '' }]} sx={{ width: 24, height: 24 }} />
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="subtitle2" fontWeight={500} color="#646464">
                    {'name'}
                  </Typography>
                </Box>
              </Box>
              <Rating ratingData={undefined} max={5} size="large" />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              Share your experience
            </Typography>
            <TextareaAutosize
              placeholder="Share your experience"
              className={styles.textArea}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Toggle
              color="primary"
              label={
                <Typography variant="subtitle2" component="span">
                  Annonymous
                </Typography>
              }
              sx={{ m: 2 }}
            />
              <CheckBox
              onChange={(e,boolean)=> setCheck(boolean)}
              label={
                <Typography variant="body1" component="span" color={'#646464'}>
                  I understand that a refund cannot be issued
                </Typography>
              }
            />
          </Box>
        
        </Box>
      </Dialog>
      {/* <Toast alertMessage="Order sent!" onClose={() => setToast(false)} open={openToast} /> */}
    </>
  );
};

export default ReviewModal;
