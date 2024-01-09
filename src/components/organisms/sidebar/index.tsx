import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import BabeStarIcon from '@/components/atoms/icons/babeStartIcon';
import FacebookIcon from '@/components/atoms/icons/facebookIcon';
import InstaIcon from '@/components/atoms/icons/instaIcon';
import LastViewIcon from '@/components/atoms/icons/lastviewedIcon';
import OrderIcon from '@/components/atoms/icons/orderIcon';
import SignoutIcon from '@/components/atoms/icons/signoutIcon';
import TicktokIcon from '@/components/atoms/icons/tiktokIcon';
import WalletIcon from '@/components/atoms/icons/walletIcon';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface IProfileSideBar {
  icon: React.ReactNode;
  uid: string | undefined | null;
  isMobile: boolean;
  logOut: () => void;
  goToPremium: () => void;
  name: string;
  email: string;
}

const ProfileSideBar = ({ isMobile, uid, icon, name, email, logOut, goToPremium }: IProfileSideBar) => {
  const router = useRouter();
  const locale  = useLocale()
  const t = useTranslations('sidebar');

  const nav = [
    {
      name: t('faq'),
      path: `/${locale}/faq`,
    },
    {
      name: t('terms'),
      path: `/${locale}/terms`,
    },
    {
      name: t('location'),
      path: `/${locale}/location`,
    },
    {
      name: t('contact'),
      path: `/${locale}/contact`,
    },
  ];

  const arr = [
    { icon: <WalletIcon />, text: t('wallet'), to: '/wallet' },
    { icon: <OrderIcon />, text: t('order'), to: '/order' },
    { icon: <LastViewIcon />, text: t('lastViwed'), to: '#' },
  ];

  return (
    <Card
      sx={{
        borderRadius: 4,
        paddingBottom: 4,
        width: isMobile ? '100%' : '284px',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={4}>
          {uid ? (
            <Box display="flex" flexDirection="column" gap={4} alignItems="center" width="100%">
              <Box display="flex" gap={2} alignItems="center" width="inherit" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar avatars={[{ alt: 'H', src: icon }]} />
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1" fontWeight={500}>
                      {name || '--'}
                    </Typography>
                    <Typography variant="subtitle2" color={'#999999'}>
                      {email || '--'}
                    </Typography>
                  </Box>
                </Box>

                <Box onClick={() => console.log('clicked')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="#999999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Box>
         {  <Button
                variant="contained"
                sx={{
                  width: 'inherit',
                  background: 'linear-gradient(77deg, #FFED34 11.3%, #FFD144 86.76%)',
                }}
                color="secondary"
                onClick={goToPremium}
              >
                {t('upgrade')}
              </Button>}
            </Box>
          ) : (
            <Box width={'100%'} display="grid" gridTemplateColumns={'1fr 1fr'} gap={3}>
              <Button
                variant="contained"
                sx={{
                  p: '12px 20px',
                  border: '1px solid #CCCCCC',

                  boxShadow: 'none',
                  width: 'auto',
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap',
                }}
                startIcon={<BabeStarIcon />}
              >
                {t('beAbabe')}
              </Button>

              <Button
                variant="outlined"
                sx={{
                  p: '12px 20px',
                  border: '1px solid #CCCCCC',

                  width: 'auto',
                  minWidth: 'fit-content',
                }}
                onClick={() => router.push('/login')}
              >
                {t('login')}
              </Button>
            </Box>
          )}
        </Box>
        {uid && (
          <Box display="flex" justifyContent="space-around">
            {arr &&
              arr?.map((item: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                  p="8px 0"
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    router.push(item?.to);
                  }}
                >
                  {item?.icon}
                  <Typography variant="subtitle2" fontWeight={500}>
                    {item?.text}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
        <Divider sx={{ marginBottom: '4px', margin: '0 15px' }} />
        <Box p="8px 16px" display="flex" gap={3} flexDirection="column">
          <Link href={`/${locale}/rent`} shallow style={{ textDecoration: 'none', color: '#1A1A1A' }}>
            <Typography variant="subtitle2" component="span" fontWeight={500}>
              {t('rent')}
            </Typography>
          </Link>
          <Divider />
        </Box>
        <Box display="flex" gap={3} flexDirection="column" p="8px 16px">
          {nav.map((item, index: number) => (
            <Link key={index} shallow href={item.path} style={{ textDecoration: 'none', color: '#1A1A1A' }}>
              <Typography variant="subtitle2" component="span" fontWeight={500}>
                {item.name}
              </Typography>
            </Link>
          ))}
        </Box>
        <Divider sx={{ marginBottom: '4px', margin: '0 15px' }} />
        {uid && (
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p="8px 16px"
            onClick={logOut}
            sx={{
              cursor: 'pointer',
            }}
          >
            {<SignoutIcon />}
            <Typography variant="subtitle2" fontWeight={500}>
              {t('signOut')}
            </Typography>
          </Box>
        )}
        <Box display="flex" alignItems="center" justifyContent="space-between" p="12px 16px 4px 16px">
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="caption" component="span" color="#999999">
              v4.1.62
            </Typography>
            <Typography variant="caption" component="span" color="#999999">
              hello@RentBabe.com
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={3}>
            <FacebookIcon />
            <InstaIcon />
            <TicktokIcon />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileSideBar;
