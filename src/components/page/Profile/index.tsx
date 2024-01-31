'use client';
import Box from '@/components/atoms/box';
import React from 'react';
import Typography from '@/components/atoms/typography';
import Verifed from '@/components/atoms/icons/verifed';
import SocialIcon from '@/components/atoms/icons/socialIcon';
import Rating from '@/components/molecules/ratings';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Menu from '@/components/atoms/popup/menu';
import MenuItem from '@/components/atoms/popup';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@/components/atoms/icons/closeIcon';
import Tabs from '@/components/atoms/tabs';
import useProfileHook from './useProfileHook';
import Button from '@/components/atoms/button';
import NextImage from '@/components/atoms/image';
import BackIcon from '@/components/atoms/icons/backIcon';
import SkeletonLine from '@/components/atoms/SkeletonLine';
import ToolTip from '@/components/atoms/tooltip';
import ReportModal from './components/reportModal';
import ShareModal from './components/shareModal';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { setRequestModalOpen } from '@/store/reducers/serviceReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { useTranslations } from 'next-intl';
import VoiceButtonComp from '@/components/organisms/voiceComp';
import { setIsOpenProfileModal } from '@/store/reducers/drawerOpenReducer';

const Profile = ({ uid }: { uid?: string | undefined }) => {
  const {
    isMobile,
    item,
    nickName,
    galleryData,
    tabsData,
    url,
    myUid,
    dateTime,
    open,
    anchorEl,
    shareModalOpen,
    reportModalOpen,
    view,
    isProfilePage,
    setAnchorEl,
    setShareModalOpen,
    handleClose,
    goBack,
    onResetTab,
    setReportModalOpen,
  } = useProfileHook(uid);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations('profile.modal');

  const dummy = [
    {
      text: (
        <Typography variant="subtitle2" component="span" fontWeight={500}>
          {t('share')}
        </Typography>
      ),
      id: 1,
    },
    {
      text: (
        <Typography variant="subtitle2" component="span" fontWeight={500} color="error">
          {t('report')}
        </Typography>
      ),
      id: 2,
    },
  ];

  return (
    <Box
      width={'100%'}
      sx={{
        background:
          'linear-gradient(293deg, rgba(255, 242, 194, 0.17) 0%, #fff7f2 100%, rgba(255, 247, 242, 0.72) 100%)',
      }}
    >
      <Box
        width={'100%'}
        bgcolor={'#fff'}
        maxWidth={isProfilePage ? 600 : '100%'}
        mx={'auto'}
        paddingBottom={isMobile ? '100px' : 0}
        // overflow={'hidden'}
        sx={{
          padding: !isProfilePage || isMobile ? '0px' : '20px',
        }}
      >
        {isProfilePage && (
          <Box
            sx={{
              padding: '20px 16px',
            }}
          >
            <Button
              startIcon={<BackIcon />}
              sx={{ width: 'fit-content', fontSize: '14px', fontWeight: 700, padding: '6px 0px' }}
              onClick={goBack}
            >
              Back
            </Button>
          </Box>
        )}

        <Box display="flex" flexDirection="column" gap={6} padding={isMobile ? '0px 16px' : '0px'}>
          <Box display="flex" justifyContent="space-between" minHeight={190} alignItems="flex-start">
            <Box display="flex" gap={6} justifyContent="flex-start" minHeight={190} alignItems="flex-start">
              <Box>
                <Box position="relative">
                  <Box width={!isMobile ? 80 : 60} height={!isMobile ? 80 : 60} position="relative">
                    <NextImage
                      src={url || ''}
                      fill
                      style={{ borderRadius: 50, objectFit: 'cover' }}
                      alt=""
                      skeletonRadius={'100px'}
                    />
                  </Box>

                  {!isProfilePage && item?.voiceUrl && <VoiceButtonComp voiceUrl={item?.voiceUrl} />}
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" flexDirection="column">
                  {item ? (
                    <Box display="flex" gap={1} alignItems="center">
                      <Typography variant="h2" component="span" sx={{ textTransform: 'capitalize' }}>
                        {nickName}
                        {`(${item?.dob || '--'})`}
                      </Typography>
                      {item?.videoVerification && (
                        <ToolTip title="This user has submitted a clear selfie photo of them holding their government issued ID to prove their identity o's new to h and they are not underage.">
                          <Verifed size={24} />
                        </ToolTip>
                      )}
                      {item?.isgToken && <SocialIcon size={24} />}
                    </Box>
                  ) : (
                    <SkeletonLine height={15} width={150} />
                  )}
                  {item ? (
                    item?.time_stamp && (
                      <Typography variant="subtitle2" color={'#999999'}>
                        {' '}
                        {`${t('lastSeen')} ${dateTime} ago`}
                      </Typography>
                    )
                  ) : (
                    <Box paddingTop={1}>
                      <SkeletonLine height={15} width={120} />
                    </Box>
                  )}
                </Box>
                {isProfilePage && item?.voiceUrl && <VoiceButtonComp voiceUrl={item?.voiceUrl} />}
                {/* {item ? ( */}
                <Box display="flex" gap={2} alignItems="center">
                  <Rating ratingData={item?.ratings} size="small" />
                  <DotIcon />
                  {view > '0' && (
                    <Typography variant="subtitle1">
                      {view} <span>Views</span>
                    </Typography>
                  )}
                </Box>
                {/* ) : (
                  <SkeletonLine height={15} width={100} />
                )} */}
                <Box display="flex" gap={2} flexDirection="column">
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      {t('availability')}:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999999' }}>
                      {item?.availability || '--'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      {item?.race || '--'}
                    </Typography>
                    <DotIcon />
                    <Typography variant="body1" fontWeight={500}>
                      {item?.mHeight ? `${item?.mHeight}cm` : '--'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      {t('locationAt')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999999' }}>
                      {item?.state || '--'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="flex-start" gap={3}>
              <Menu
                open={open}
                setAnchorEl={setAnchorEl}
                onClose={() => setAnchorEl(null)}
                icon={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                anchorEl={anchorEl}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                sx={{ '.MuiPaper-root': { borderRadius: 3 } }}
              >
                {dummy &&
                  dummy.map((item: any) => (
                    <MenuItem key={item.id} onClick={() => handleClose(item.id)}>
                      {item.text}
                    </MenuItem>
                  ))}
              </Menu>
              {!isProfilePage && !isMobile && (
                <IconButton>
                  <CloseIcon onClick={() => dispatch(setIsOpenProfileModal(false))} />
                </IconButton>
              )}
            </Box>
          </Box>
          {item ? (
            <Box bgcolor="#F9F9F9" padding={4} borderRadius={6} marginLeft={isMobile ? '0px' : '100px'}>
              <Tabs tabsData={tabsData} onTabChange={onResetTab} />
            </Box>
          ) : (
            <Box padding={4} borderRadius={6} marginLeft={isMobile ? '0px' : '100px'}>
              <SkeletonLine height={300} width={'100%'} radius={4} />
            </Box>
          )}
          <Box
            marginLeft={isMobile ? '0px' : '100px '}
            sx={{
              paddingBottom: isProfilePage ? 25 : 0,
            }}
          >
            <Tabs tabBottomPadding="24px" tabsData={galleryData} />
          </Box>
        </Box>
      </Box>

      {isProfilePage && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
            position: 'fixed',
            bottom: '0px',
            backgroundColor: '#FFF',
            width: '100%',
            padding: '16px',
            zIndex: 5,
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: 'fit-content',
              background: 'linear-gradient(77deg, #FFED34 11.3%, #FFD144 86.76%)',
            }}
            color="secondary"
            onClick={() => {
              if (!myUid) router.push('/login');
              dispatch(setRequestModalOpen(true));
            }}
          >
            {t('requestOrder')}
          </Button>
          <Typography variant="caption" component="span">
            {t('requestMessage')}
          </Typography>
        </Box>
      )}

      <ShareModal shareModalOpen={shareModalOpen} setShareModalOpen={setShareModalOpen} item={item} imgUrl={url} />
      <ReportModal
        reportModalOpen={reportModalOpen}
        setReportModalOpen={setReportModalOpen}
        reportBy={myUid}
        user={item?.uid}
      />
    </Box>
  );
};

export default Profile;
