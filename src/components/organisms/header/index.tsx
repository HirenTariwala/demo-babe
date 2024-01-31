'use client';
import React from 'react';
import { Drawer } from '@mui/material';
import ProfileSideBar from '../sidebar';
import styles from './header.module.css';
import useHeaderHook from './useHeaderHook';
import { languageData } from '@/common/utils/data';
import Badge from '@/components/atoms/badge';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import BabeStarIcon from '@/components/atoms/icons/babeStartIcon';
import ChatIcon from '@/components/atoms/icons/chatIcon';
import LogoIcon from '@/components/atoms/icons/logo';
import ProfileIcon from '@/components/atoms/icons/profile';
import Dropdown from '@/components/molecules/dropdown';
import Menu from '@/components/atoms/popup/menu';
import CloseIcon from '@/components/atoms/icons/closeIcon';
import { useTranslations } from 'next-intl';
import NavBar from '@/components/molecules/navbar';
import NextImage from '@/components/atoms/image';
import Chat from '@/components/page/Chat';
import Avatar from '@/components/atoms/avatar';

const Header = () => {
  const {
    uid,
    profileImage,
    isMobile,
    isTablet,
    isopen,
    open,
    pathName,
    router,
    anchorEl,
    value,
    currentUser,
    isOpenChatDrawer,
    handleChatDrawerChange,
    goToPremium,
    logOut,
    setAnchorEl,
    setOpen,
    handleAnchorElChange,
    handleChange,
  } = useHeaderHook();
  const t = useTranslations('header');
  const nav = [
    {
      name: t('rent'),
      path: `/${value}/rent`,
    },
    {
      name: t('faq'),
      path: `/${value}/faq`,
    },
    {
      name: t('terms'),
      path: `/${value}/terms`,
    },
    {
      name: t('location'),
      path: `/${value}/location`,
    },
    {
      name: t('contact'),
      path: `/${value}/contact`,
    },
  ];

  return (
    <>
      <Box
        p={isMobile ? '12px 16px' : '16px 40px'}
        display="flex"
        alignItems="center"
        boxShadow={'0px 2px 8px 0px rgba(0, 0, 0, 0.10)'}
        justifyContent="space-between"
        position={'fixed'}
        width={'100%'}
        maxWidth={'100vw'}
        top={0}
        zIndex={100}
        bgcolor="#FFF"
      >
        <Box display="flex" gap={8} alignItems="center">
          <Box onClick={() => router.push(`/`)} sx={{ cursor: 'pointer' }}>
            <LogoIcon />
          </Box>
          {!isTablet && <NavBar pathName={pathName} nav={nav} />}
        </Box>

        <Box>
          <Box display="flex" gap={isMobile ? 0 : 4} alignItems="center">
            <Dropdown
              listData={languageData}
              value={value}
              size="small"
              sx={{
                '.MuiOutlinedInput-notchedOutline': { border: 'none !important' },
              }}
              onChange={handleChange}
            ></Dropdown>
            {!isMobile && (
              <Button variant="contained" startIcon={<BabeStarIcon />} className={styles.beABabeButton}>
                {t('beAbabe')}
              </Button>
            )}
            {uid && (
              <Button variant="outlined" className={styles.chatIcon} onClick={handleChatDrawerChange}>
                <ChatIcon />
              </Button>
            )}

            {uid && !isMobile && (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <NextImage
                    width={28}
                    height={28}
                    src={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/menu.svg`}
                    alt=""
                  />
                }
                sx={{
                  '.MuiBadge-anchorOriginBottomRight': {
                    bottom: '30%',
                    right: '30%',
                    background: '#FFF',
                    padding: 0,
                    zIndex: 5,
                  },
                  cursor: 'pointer',
                }}
                onClick={anchorEl ? () => setAnchorEl(null) : handleAnchorElChange}
              >
                <Menu
                  open={open}
                  setAnchorEl={() => {}}
                  onClose={() => setAnchorEl(null)}
                  icon={
                    <Avatar avatars={[{ src: profileImage ? profileImage : <ProfileIcon size={40} />, alt: '' }]} />
                  }
                  anchorEl={anchorEl}
                  sx={{ '.MuiMenu-list': { paddingBottom: 0, paddingTop: 0 } }}
                >
                  {
                    <ProfileSideBar
                      icon={
                        <Avatar avatars={[{ src: profileImage ? profileImage : <ProfileIcon size={40} />, alt: '' }]} />
                      }
                      uid={uid}
                      isMobile={isMobile}
                      logOut={logOut}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      name={currentUser?.nickname || currentUser?.nick || ''}
                      email={currentUser?.email || ''}
                      goToPremium={goToPremium}
                    />
                  }
                </Menu>
              </Badge>
            )}
            {!uid && !isMobile && (
              <Button className={styles.loginButton} variant="outlined" onClick={() => router.push(`/login`)}>
                {t('login')}
              </Button>
            )}
            {isMobile && (
              <>
                <Box onClick={() => setOpen(!isopen)}>
                  {!isopen ? (
                    <NextImage
                      width={24}
                      height={24}
                      src={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/Menu.svg`}
                      alt=""
                      style={{
                        margin: '8px',
                      }}
                    />
                  ) : (
                    <CloseIcon
                      fontSize="small"
                      style={{
                        margin: '8px',
                      }}
                    />
                  )}
                </Box>
                <Drawer
                  anchor={'top'}
                  open={isopen}
                  componentsProps={{ backdrop: { style: { display: 'none' } } }}
                  sx={{
                    '.MuiDrawer-paperAnchorTop': { top: 65 },
                    'MuiBackdrop-root-MuiModal-backdrop': { display: 'none' },
                    top: 100,
                  }}
                >
                  <Box onClick={() => setOpen(!isopen)}>
                    <ProfileSideBar
                      icon={
                        <Avatar avatars={[{ src: profileImage ? profileImage : <ProfileIcon size={40} />, alt: '' }]} />
                      }
                      uid={uid}
                      isMobile={isMobile}
                      logOut={logOut}
                      goToPremium={goToPremium}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      name={currentUser?.nickname || currentUser?.nick || ''}
                      email={currentUser?.email || ''}
                    />
                  </Box>
                </Drawer>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Drawer
        anchor={'right'}
        open={isOpenChatDrawer}
        componentsProps={{ backdrop: { style: { display: 'block' } } }}
        sx={{
          'MuiBackdrop-root-MuiModal-backdrop': { display: 'block' },
          top: 100,
          '.MuiDrawer-paper': {
            height: 'auto',
            width: 'auto',
            bottom: 0,
          },
        }}
        onClose={handleChatDrawerChange}
      >
        <Chat onDrawerClose={handleChatDrawerChange} />
      </Drawer>
    </>
  );
};

export default Header;
