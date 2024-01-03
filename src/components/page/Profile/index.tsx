'use client';
import Box from '@/components/atoms/box';
import React from 'react';
import Typography from '@/components/atoms/typography';
import Verifed from '@/components/atoms/icons/verifed';
import SocialIcon from '@/components/atoms/icons/socialIcon';
import Rating from '@/components/molecules/ratings';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Menu from '@/components/atoms/popup/menu';
import { dummy } from '@/common/utils/data';
import MenuItem from '@/components/atoms/popup';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@/components/atoms/icons/closeIcon';
import Tabs from '@/components/atoms/tabs';
import useProfileHook from './useProfileHook';
import Button from '@/components/atoms/button';
import NextImage from '@/components/atoms/image';
import BackIcon from '@/components/atoms/icons/backIcon';
import PlayIcon from '@/components/atoms/icons/playIcon';
import AudioWavesIcon from '@/components/atoms/icons/audioWavesIcon';
import SkeletonLine from '@/components/atoms/SkeletonLine';
import ToolTip from '@/components/atoms/tooltip';
import ReportModal from './components/reportModal';
import ShareModal from './components/shareModal';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import RequestOrderModal from './components/requestOrderModal';
import { setRequestModalOpen, useRequestModal } from '@/store/reducers/serviceReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { useTranslations } from 'next-intl';

const Profile = ({
  uid,
  onClick,
  setOpen,
}: {
  uid?: string | undefined;
  onClick?: () => void;
  setOpen?: (arg: boolean) => void;
}) => {
  const {
    isMobile,
    item,
    nickName,
    galleryData,
    tabsData,
    url,
    isTablet,
    myUid,
    dateTime,
    open,
    anchorEl,
    shareModalOpen,
    duration,
    isAudioPlaying,
    reportModalOpen,
    view,
    isProfilePage,
    voiceOnClick,
    setAnchorEl,
    setShareModalOpen,
    handleClose,
    goBack,
    onResetTab,
    setReportModalOpen,
  } = useProfileHook(uid);
  const dispatch = useAppDispatch();

  const router = useRouter();
  const isModalOpen = useRequestModal();
  const t = useTranslations('profile.modal')
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
        overflow={'hidden'}
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
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={6}>
              <Box width={isMobile ? 60 : 80} height={isMobile ? 60 : 80}>
                <NextImage
                  src={url || ''}
                  width={isMobile ? 60 : 80}
                  height={isMobile ? 60 : 80}
                  style={{ borderRadius: 50, objectFit: 'cover' }}
                  alt=""
                  skeletonRadius={'100px'}
                />
                {!isProfilePage && item?.voiceUrl && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '80px',
                      left: '15px',
                    }}
                  >
                    <Button
                      onClick={voiceOnClick}
                      sx={{
                        display: 'flex',
                        width: 'fit-content',
                        height: '36px',
                        padding: '6px 12px 6px 8px',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        gap: '8px',
                        borderRadius: '360px',
                        background: '#FFF',
                        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
                        ':hover': {
                          background: '#FFF',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <Box
                          sx={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#FFD443',
                            borderRadius: '100px',
                          }}
                        >
                          <PlayIcon />
                        </Box>
                        <Box
                          sx={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {!isAudioPlaying ? (
                            <AudioWavesIcon />
                          ) : (
                            <NextImage
                              src="https://images.rentbabe.com/assets/gif/wave2.gif"
                              width={20}
                              height={20}
                              alt=""
                            />
                          )}
                        </Box>
                        <Box>{duration}s</Box>
                      </Box>
                    </Button>
                  </Box>
                )}
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
                        {`Last seen ${dateTime} ago`}
                      </Typography>
                    )
                  ) : (
                    <Box paddingTop={1}>
                      <SkeletonLine height={15} width={120} />
                    </Box>
                  )}
                </Box>
                {isProfilePage && item?.voiceUrl && (
                  <Box>
                    <Button
                      onClick={voiceOnClick}
                      sx={{
                        display: 'flex',
                        width: 'fit-content',
                        height: '36px',
                        padding: '6px 12px 6px 8px',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        gap: '8px',
                        borderRadius: '360px',
                        background: '#FFF',
                        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <Box
                          sx={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#FFD443',
                            borderRadius: '100px',
                          }}
                        >
                          <PlayIcon />
                        </Box>
                        <Box
                          sx={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {!isAudioPlaying ? (
                            <AudioWavesIcon />
                          ) : (
                            <NextImage
                              src="https://images.rentbabe.com/assets/gif/wave2.gif"
                              width={20}
                              height={20}
                              alt=""
                            />
                          )}
                        </Box>
                        <Box>{duration}s</Box>
                      </Box>
                    </Button>
                  </Box>
                )}
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
                  {/* {item ? ( */}
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      Availability:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999999' }}>
                      {item?.availability || '--'}
                    </Typography>
                  </Box>
                  {/* ) : (
                    <SkeletonLine height={15} width={100} />
                  )} */}
                  {/* {item ? ( */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      {item?.race || '--'}
                    </Typography>
                    <DotIcon />
                    <Typography variant="body1" fontWeight={500}>
                      {item?.mHeight ? `${item?.mHeight}cm` : '--'}
                    </Typography>
                  </Box>
                  {/* ) : (
                    <SkeletonLine height={15} width={100} />
                  )} */}
                  {/* {item ? ( */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      Location at
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999999' }}>
                      {item?.state || '--'}
                    </Typography>
                  </Box>
                  {/* ) : (
                    <SkeletonLine height={15} width={100} />
                  )} */}
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
                    <MenuItem key={item.id} onClick={() => handleClose(item.text)}>
                      {item.text}
                    </MenuItem>
                  ))}
              </Menu>
              {!isProfilePage && !isMobile && (
                <IconButton>
                  <CloseIcon onClick={onClick} />
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
              paddingBottom: isProfilePage ? 50 : 0,
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
      <RequestOrderModal isMobile={isMobile} isTablet={isTablet} isOpen={isModalOpen} setOpen={setOpen} />
    </Box>
  );
};

export default Profile;
