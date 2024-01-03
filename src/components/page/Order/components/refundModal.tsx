import React, { useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import { TextareaAutosize } from '@mui/material';
import styles from '../order.module.css';
import Price from '@/components/molecules/price';
import NextImage from '@/components/atoms/image';
import { ServiceHelper } from '@/utility/serviceHelper';
import DragUpload from '@/components/molecules/upload/dragupload';

interface IRefundOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  setOpen: (arg: boolean) => void | undefined;
}

const RefundModal = ({ isMobile, isTablet, isOpen, setOpen }: IRefundOrderModal) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const onChangeHandle = (files: File | undefined) => {
    if (files !== null && files) {
      setFile(files);
    }
  };
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
            Refund
          </Typography>
          <Typography variant="body1" color="#646464">
          Please issue refund within 72 hours. You may update your refund request by re-submitting it.
          </Typography>
          <Box display="flex" gap={3} justifyContent="space-between">
            <Box display="flex" gap={3}>
              <NextImage
                src={
                  'https://images.rentbabe.com/MOBILE/QJXbLQyagwgMzvnWoi42nB0jOB93/0.jpg?&t=1694524869953&rentbh=1000&rentbw=1000'
                }
                alt={'image'}
                width={80}
                height={80}
                style={{ borderRadius: 12 }}
              />
              <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                gap={3}
                width="-webkit-fill-available"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="h5" component="span">
                    {'service name'}
                  </Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar avatars={[{ alt: 'H', src: '' }]} sx={{ width: 24, height: 24 }} />
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="subtitle2" fontWeight={500} color="#646464">
                        {'name'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Price
              priceData={{
                price: 12000 || 0,
                min: 12000 || 0,
                max: 12000 || 0,
                hr: ServiceHelper.convertUnits(1),
              }}
              category="1"
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              Refund reason
            </Typography>
            <TextareaAutosize
              placeholder="Refund reason"
              className={styles.textArea}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box  display="flex" flexDirection="column" gap={1}>
          <Typography variant="subtitle2" fontWeight={500}>
             Photo evidence
            </Typography>
            <DragUpload name="frontid" isImageViewAuto={false} setImage={onChangeHandle} />
        {file && (
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <NextImage
              src={URL.createObjectURL(file)}
              width={50}
              height={50}
              style={{
                borderRadius: '12px',
              }}
              alt="file"
            />
            <Typography variant="body2" fontWeight={500} color="#1A1A1A" component={'span'}>
              {file?.name}
            </Typography>
          </Box>
        )}
          </Box>
        </Box>
      </Dialog>
      {/* <Toast alertMessage="Order sent!" onClose={() => setToast(false)} open={openToast} /> */}
    </>
  );
};

export default RefundModal;
