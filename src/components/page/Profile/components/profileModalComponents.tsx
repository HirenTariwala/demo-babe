import Dialog from '@/components/molecules/dialogs';
import React from 'react';
import Profile from '..';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';

interface IProfileModal {
  uid: string;
  isOpen: boolean;
  onClick: () => void;
  isMobile: boolean;
}

const ProfileModalComponents = ({ uid, isOpen, onClick, isMobile }: IProfileModal) => {
  return (
    <>
      <Dialog
        maxWidth="lg"
        onClose={onClick}
        footer={
          !isMobile ? (
            <Box display="flex" flexDirection="column" gap={3} alignItems="center">
              <Button
                variant="contained"
                sx={{
                  width: 'fit-content',
                  background: 'linear-gradient(77deg, #FFED34 11.3%, #FFD144 86.76%)',
                }}
                color="secondary"
                onClick={onClick}
              >
                Request an order
              </Button>
              <Typography variant="caption" component="span">
                We only issue refund within 72 hours from the date of purchase
              </Typography>
            </Box>
          ) : null
        }
        sx={{
          '.MuiPaper-root': {
            borderRadius: '24px',
          },
        }}
        open={isOpen}
      >
        <Profile uid={uid} onClick={onClick} />
      </Dialog>
    </>
  );
};

export default ProfileModalComponents;
