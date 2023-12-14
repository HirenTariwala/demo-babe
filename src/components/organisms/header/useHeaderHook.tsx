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
  const { uid, logOut } = useLoginHook();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(useLocale());

  const open = Boolean(anchorEl);
  console.log(isPending);
  
  const handleAnchorElChange = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const profileImage = '';

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathName, { locale: nextLocale });
    });
  };

  return {
    uid,
    profileImage,
    isMobile,
    isTablet,
    open,
    isopen,
    router,
    pathName,
    anchorEl,
    value,
    logOut,
    setAnchorEl,
    setOpen,
    handleAnchorElChange,
    handleChange,
  };
};

export default useHeaderHook;
