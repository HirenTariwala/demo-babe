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
import SimpleDialog from '@/components/atoms/modal';
import Button from '@/components/atoms/button';
import NextImage from '@/components/atoms/image';
import BackIcon from '@/components/atoms/icons/backIcon';
import PlayIcon from '@/components/atoms/icons/playIcon';
import AudioWavesIcon from '@/components/atoms/icons/audioWavesIcon';

const Profile = ({ uid, onClick }: { uid: string; onClick?: () => void }) => {
  const {
    isMobile,
    item,
    galleryData,
    tabsData,
    url,
    dateTime,
    open,
    anchorEl,
    shareModalOpen,
    duration,
    isAudioPlaying,
    voiceOnClick,
    setAnchorEl,
    setShareModalOpen,
    handleClose,
    goBack,
  } = useProfileHook(uid);

  return (
    <>
      <Box maxWidth={952} width={'100%'} paddingBottom={isMobile ? '100px' : 0} overflow={'hidden'}>
        {isMobile && (
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
                />
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" gap={1} alignItems="center">
                    <Typography variant="h2">
                      {item?.nickname || ''}
                      {`(${item?.dob || ''})`}
                    </Typography>
                    {item?.videoVerification && <Verifed size={24} />}
                    {item?.isgToken && <SocialIcon size={24} />}
                  </Box>
                  {item?.time_stamp && (
                    <Typography variant="subtitle2" color={'#999999'}>
                      {' '}
                      {`Last seen ${dateTime} ago`}
                    </Typography>
                  )}
                </Box>
                {isMobile && item?.voiceUrl && (
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
                <Box display="flex" gap={2} alignItems="center">
                  <Rating ratingData={item?.ratings} size="small" />
                  <DotIcon />
                  <Typography variant="subtitle1">
                    1.6k <span>Views</span>
                  </Typography>
                </Box>
                <Box display="flex" gap={2} flexDirection="column">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      Availability:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999999' }}>
                      {item?.availability}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      {item?.race}
                    </Typography>
                    <DotIcon />
                    <Typography variant="body1" fontWeight={500}>
                      {`${item?.mHeight}cm`}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight={500}>
                      Location at
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#999999' }}>
                      {item?.state}
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
                icon={<MoreVertIcon />}
                anchorEl={anchorEl}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                {dummy &&
                  dummy.map((item: any) => (
                    <MenuItem key={item.id} onClick={() => handleClose(item.text)}>
                      {item.text}
                    </MenuItem>
                  ))}
              </Menu>
              {!isMobile && <CloseIcon onClick={onClick} />}
            </Box>
          </Box>
          <Box bgcolor="#F9F9F9" padding={4} borderRadius={6} marginLeft={isMobile ? '0px' : '100px'}>
            <Tabs tabsData={tabsData} />
          </Box>
          <Box marginLeft={isMobile ? '0px' : '100px '}>
            <Tabs tabBottomPadding="24px" tabsData={galleryData} />
          </Box>
        </Box>
      </Box>
      {isMobile && (
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
            onClick={onClick}
          >
            Request an order
          </Button>
          <Typography variant="caption" component="span">
            We only issue refund within 72 hours from the date of purchase
          </Typography>
        </Box>
      )}

      <SimpleDialog
        footer={<Button onClick={() => setShareModalOpen(false)}>Cancel</Button>}
        open={shareModalOpen}
        title={'Share Profile'}
      >
        this is modal
      </SimpleDialog>
    </>
  );
};

export default Profile;
