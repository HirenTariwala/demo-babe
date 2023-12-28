'use client';
import React from 'react';
import { Drawer } from '@mui/material';
// import Image from 'next/image';
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
    isOpenChat,
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
      path: '/rent',
    },
    {
      name: t('faq'),
      path: '/faq',
    },
    {
      name: t('terms'),
      path: '/terms',
    },
    {
      name: t('location'),
      path: '/location',
    },
    {
      name: t('contact'),
      path: '/contact',
    },
  ];

  return (
    <Box
      p={isMobile ? '12px 16px' : '16px 40px'}
      display="flex"
      alignItems="center"
      boxShadow={'0px 2px 8px 0px rgba(0, 0, 0, 0.10)'}
      justifyContent="space-between"
      // position={isMobile ? 'relative' : 'unset'}
      position={'fixed'}
      width={'100%'}
      maxWidth={'100vw'}
      top={0}
      zIndex={1300}
      bgcolor="#FFF"
    >
      <Box display="flex" gap={8} alignItems="center">
        <Box>
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
                  profileImage ? (
                    <NextImage src={profileImage} alt="Profile" width={40} height={40} />
                  ) : (
                    <ProfileIcon size={40} />
                  )
                }
                anchorEl={anchorEl}
                sx={{ '.MuiMenu-list': { paddingBottom: 0, paddingTop: 0 } }}
              >
                {
                  <ProfileSideBar
                    icon={<ProfileIcon />}
                    uid={uid}
                    isMobile={isMobile}
                    logOut={logOut}
                    name={currentUser?.nickname || ''}
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
                    icon={<ProfileIcon />}
                    uid={uid}
                    isMobile={isMobile}
                    logOut={logOut}
                    goToPremium={goToPremium}
                    name={currentUser?.nickname || ''}
                    email={currentUser?.email || ''}
                  />
                </Box>
              </Drawer>
            </>
          )}
        </Box>
      </Box>
      <Drawer
        anchor={'right'}
        open={isOpenChat}
        componentsProps={{ backdrop: { style: { display: 'none' } } }}
        // sx={{
        //   '.MuiDrawer-paperAnchorTop': { top: 65 },
        //   'MuiBackdrop-root-MuiModal-backdrop': { display: 'none' },
        //   top: 100,
        // }}
        onClose={handleChatDrawerChange}
      >
        Hello Chat
      </Drawer>
    </Box>
  );
};

export default Header;
