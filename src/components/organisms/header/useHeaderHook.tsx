import { SelectChangeEvent, useMediaQuery } from '@mui/material';
import { useState, useTransition } from 'react';
import useLoginHook from '@/components/page/Login/Form/useLoginHook';
import { usePathname, useRouter } from 'next-intl/client';
import { useLocale } from 'next-intl';

const useHeaderHook = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isopen, setOpen] = useState<boolean>(false);
  const isTablet = useMediaQuery('(max-width:1024px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const { uid, logOut, currentUser } = useLoginHook();
  const [isPending] = useTransition();
  const [value, setValue] = useState(useLocale());
  const [isOpenChat, setIsOpenChat] = useState(false);

  const open = Boolean(anchorEl);

  const handleAnchorElChange = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const profileImage = '';

  const handleChange = (event: SelectChangeEvent) => {
    const nextLocale = event?.target?.value;
    setValue(nextLocale);
      router.replace(pathName, { locale: nextLocale });
  
  };

  const goToPremium = () => {
    router.push(`/subscribe?uid=${uid}`);
  };
  const handleChatDrawerChange = () => {
    setIsOpenChat(!isOpenChat);
  };

  return {
    uid,
    profileImage,
    isMobile,
    isTablet,
    open,
    isopen,
    isPending,
    router,
    pathName,
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
  };
};

export default useHeaderHook;
