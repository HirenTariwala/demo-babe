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
import { setIsOpenProfileModal } from '@/store/reducers/drawerOpenReducer';
import { useMediaQuery } from '@mui/material';

interface IProfileModal {
  uid?: string;
  isOpen: boolean;
}

const ProfileModalComponents = ({ isOpen }: IProfileModal) => {
  const { currentUser } = useUserStore();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations('profile.modal');
  return (
    <>
      <Dialog
        maxWidth="lg"
        onClose={() => {
          dispatch(setIsOpenProfileModal(false));
        }}
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
                onClick={() => {
                  if (!currentUser?.uid) {
                    router.push('/login');
                  } else {
                    dispatch(setIsOpenProfileModal(false));
                    dispatch(setRequestModalOpen(true));
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
            overflow: 'visible',
          },
          '.MuiDialogActions-root': {
            justifyContent: 'center',
            position: 'sticky',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
          },
        }}
        open={isOpen}
      >
        <Profile />
      </Dialog>
    </>
  );
};

export default ProfileModalComponents;
