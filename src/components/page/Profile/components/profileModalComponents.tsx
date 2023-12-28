import Dialog from '@/components/molecules/dialogs';
import React from 'react';
import Profile from '..';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import { Item } from '@/props/profileProps';

interface IProfileModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  babeInfo: Item | undefined;
  onClick: () => void;
  setRequestModalOpen:(arg: boolean) => void;
}

const ProfileModalComponents = ({ isOpen, babeInfo,onClick,setRequestModalOpen, isMobile, isTablet }: IProfileModal) => {
  return (
    <>
      <Dialog
        maxWidth="lg"
        onClose={onClick}
        footer={
          !isMobile ? (
            <Box display="flex" flexDirection="column" gap={3} alignItems="center" justifyContent="center">
              <Button
                variant="contained"
                sx={{
                  width: 'fit-content',
                  background: 'linear-gradient(77deg, #FFED34 11.3%, #FFD144 86.76%)',
                }}
                color="secondary"
                onClick={()=>{
                  onClick()
                  setRequestModalOpen(true)
                }}
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
            height: '100%',
            width: isMobile ? '100%' : isTablet ? '800px' : '1000px',
          },
          '.MuiDialogContent-root': {
            position: 'relative',
          },
          '.MuiDialogActions-root':{
            justifyContent: 'center',
          }
        }}
        open={isOpen}
      >
        <Profile babeInfo={babeInfo} onClick={onClick} setRequestModalOpen={setRequestModalOpen}/>
      </Dialog>
    </>
  );
};

export default ProfileModalComponents;
