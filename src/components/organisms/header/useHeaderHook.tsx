import { SelectChangeEvent, useMediaQuery } from '@mui/material';
import { useEffect, useState, useTransition } from 'react';
import useLoginHook from '@/components/page/Login/Form/useLoginHook';
import { usePathname, useRouter } from 'next-intl/client';
import { useLocale } from 'next-intl';
import { setSelectedConversation } from '@/store/reducers/conversationReducer';
import { useAppDispatch } from '@/store/useReduxHook';
import { setIsOpenChatDrawer, useDrawerOpenStore } from '@/store/reducers/drawerOpenReducer';

const useHeaderHook = () => {
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isopen, setOpen] = useState<boolean>(false);
  const isTablet = useMediaQuery('(max-width:1024px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const { uid, logOut, currentUser } = useLoginHook();
  const [isPending] = useTransition();
  const [value, setValue] = useState(useLocale());
  const { isOpenChatDrawer } = useDrawerOpenStore();

  const open = Boolean(anchorEl);

  const handleAnchorElChange = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const profileImage = currentUser?.profileImage || '';

  const handleChange = (event: SelectChangeEvent) => {
    const nextLocale = event?.target?.value;
    setValue(nextLocale);
    router.replace(pathName, { locale: nextLocale });
  };

  const goToPremium = () => {
    router.push(`/subscribe?uid=${uid}`);
  };
  const handleChatDrawerChange = () => {
    dispatch(setSelectedConversation({ data: undefined }));
    if (isMobile) {
      router?.push(`/chat?uid=${uid}`);
    } else {
      dispatch(setIsOpenChatDrawer(!isOpenChatDrawer));
    }
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
    isOpenChatDrawer,
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
