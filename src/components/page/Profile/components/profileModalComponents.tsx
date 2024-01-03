import Dialog from '@/components/molecules/dialogs';
import React from 'react';
import Profile from '..';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setRequestModalOpen } from '@/store/reducers/serviceReducer';
import { useTranslations } from 'next-intl';

interface IProfileModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  onClick: () => void;
  setOpen:(arg: boolean) => void;

}

const ProfileModalComponents = ({ isOpen, setOpen,onClick, isMobile, isTablet }: IProfileModal) => {
  const {currentUser} = useUserStore()
  const router = useRouter()
  const dispatch = useDispatch()
  const t= useTranslations('profile.modal')
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
                  if(!currentUser?.uid) {
                    router.push("/login")
                  }else{
                    setOpen(false)
                    dispatch(setRequestModalOpen(true))
                  }
                }}
              >
                {t('requestOrder')}
              </Button>
              <Typography variant="caption" component="span">
                {t('requestMessage')}
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
          '.MuiDialogActions-root': {
            justifyContent: 'center',
          },
        }}
        open={isOpen}
      >
        <Profile onClick={onClick} setOpen={setOpen}/>
      </Dialog>
    </>
  );
};

export default ProfileModalComponents;
