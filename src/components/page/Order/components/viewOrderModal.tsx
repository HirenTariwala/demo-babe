import React from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import Dialog from '@/components/molecules/dialogs';
import Price from '@/components/molecules/price';
import { ServiceHelper } from '@/utility/serviceHelper';
import NextImage from '@/components/atoms/image';
import Order from '@/components/molecules/content/order';
import Chip from '@/components/atoms/chip';
import { getColor } from '@/common/utils/getcolor';

interface IRequestOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  setOpen: (arg: boolean) => void | undefined;
}

const ViewOrderModal = ({ isMobile, isTablet, isOpen, setOpen }: IRequestOrderModal) => {
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
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => {}}
            >
              Update request
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
            Order details
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
                  <Chip
                    label={'Completed'}
                    sx={{
                      color: getColor('success'),
                      padding: '6px 8px',
                      width: 'fit-content',
                      paddingLeft: 0,
                      paddingRight: 0,
                      borderRadius: 3,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: '16px',
                      height: 28,
                    }}
                    size="small"
                  />
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
          <Typography variant="body1" fontWeight={500}>
            We have refunded you the Credits to your Wallet
          </Typography>
          <Box bgcolor="#F9F9F9" padding={3} borderRadius={3}>
            <Order orderData={{ date: 'Thu, Aug 31', time: '12:24PM – 2:24PM' }} meals />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2" fontWeight={500} component="span">
              Refund reason
            </Typography>
            <Typography variant="body1" component="span" color="#646464">
              scam
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2" fontWeight={500} component="span">
              Photo evidence
            </Typography>
            <NextImage src={''} alt={'image'} width={80} height={80} style={{ borderRadius: 12 }} />
          </Box>
        </Box>
      </Dialog>
      {/* <Toast alertMessage="Order sent!" onClose={() => setToast(false)} open={openToast} /> */}
    </>
  );
};

export default ViewOrderModal;
