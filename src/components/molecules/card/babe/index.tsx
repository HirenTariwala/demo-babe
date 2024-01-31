import React, { MouseEvent } from 'react';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { Card, CardContent, CardProps } from '@mui/material';
// import Image from 'next/image';
import Avatar from '@/components/atoms/avatar';
import Rating from '../../ratings';
import Price from '../../price';
import StatusDot from '@/components/atoms/icons/statusDot';
import Verifed from '@/components/atoms/icons/verifed';
import SocialIcon from '@/components/atoms/icons/socialIcon';
import Chip from '@/components/atoms/chip';
import Lighting from '@/components/atoms/icons/lighting';
// import VoiceIcon from '@/components/atoms/icons/voice-icon';
import FireBlack from '@/components/atoms/icons/fireblack';
import LocationIcon from '@/components/atoms/icons/locationIcon';
import Time from '../../time';
import { Helper } from '@/utility/helper';
import { Timestamp } from 'firebase/firestore';
import { ServiceHelper } from '@/utility/serviceHelper';
import { servicesKey } from '@/keys/firestoreKeys';
import { useServicesStore } from '@/store/reducers/serviceReducer';
import NextImage from '@/components/atoms/image';
// import useVoiceButtom from './VoiceButtom';
import VoiceButtom from './VoiceButtom';
import { ServiceTypeEnum } from '@/props/servicesProps';
import dayjs from 'dayjs';
import { Item } from '@/props/profileProps';
import ToolTip from '@/components/atoms/tooltip';
import { useTranslations } from 'next-intl';

interface IBabeCard extends CardProps {
  babeData: any;
  size?: 'small' | 'medium';
  isFavourite?: boolean;
  category?: string;
  categoryTitle?: string;
  categoryObj?: any;
  favouritesV2?: any;
  onClickHandler: (e: MouseEvent, obj: Item) => void;
}

const BabeCard = ({
  babeData,
  size,
  isFavourite,
  category,
  categoryTitle,
  categoryObj,
  favouritesV2,
  onClickHandler,
  ...props
}: IBabeCard) => {
  const allServicesArr = useServicesStore();
  const t = useTranslations('profile')

  const iAmFreeToday = babeData?.end ? Helper.amIFreeToday(Timestamp?.fromDate(new Date(babeData?.end))) : false;
  const servicesList = ServiceHelper.getServices(
    babeData?.services,
    category,
    categoryTitle,
    favouritesV2,
    allServicesArr?.services
  );

  const priceObj: { price: number; minPrice: number; maxPrice: number } = {
    price: 0,
    minPrice: 0,
    maxPrice: 0,
  };

  if (category && parseInt(category) !== 0) {
    priceObj.price = babeData?.[servicesKey]?.[categoryObj?.serviceType]?.[category]?.price;
  } else {
    priceObj.minPrice = ServiceHelper.getMinPrice(babeData?.services) || 0;
    priceObj.maxPrice = ServiceHelper.getMaxPrice(babeData?.services) || 0;
    priceObj.price = ServiceHelper.getFirstServicePrice(babeData?.services) || 0;
  }

  const fromTime = babeData?.start ? dayjs(babeData?.start)?.format('hh:mm A') : '';
  const endTime = babeData?.start ? dayjs(babeData?.end)?.format('hh:mm A') : '';

  // if (babeData?.nickname === 'zyxn') {
  //   // const temp1 = Object.values(babeData?.services).map((item: any) => Object.values(item)?.[0]);
  //   console.log(babeData, iAmFreeToday);
  // }
  const isLive = process.env.NEXT_PUBLIC_AUTH_DOMAIN === 'rentbabe.com';

  return (
    <Card
      sx={{
        backdropFilter: 'blur(20px) !important',
        overflow: 'unset',
        // minWidth: size === 'small' ? 165 : 256,
        width: '100%',
        padding: size === 'small' ? '8px 4px' : 2,
        borderRadius: 4,
        boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.10)',
        cursor: 'pointer',
        zIndex: 9,
      }}
      {...props}
    >
      <Box
        sx={{ width: '100%', height: '100%', zIndex: 9, position: 'absolute' }}
        onClick={(e) => onClickHandler(e, babeData)}
      ></Box>
      <CardContent sx={{ p: 0 }}>
        {!isFavourite && (
          <Box
            mb={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: '0 8px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="h4"
                component={'span'}
                sx={{ textTransform: 'capitalize' }}
                fontSize={size === 'small' ? 16 : 18}
              >
                {babeData?.nickname || babeData?.nick || '-'}
              </Typography>
              {babeData?.isOnline && <StatusDot />}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                sx={{
                  zIndex: 10,
                }}
              >
                <ToolTip title={t('verificationTooltipText')}>
                  {babeData?.videoVerification && <Verifed size={size === 'small' ? 20 : 24} />}
                </ToolTip>
              </Box>
              {babeData?.isgToken && <SocialIcon size={size === 'small' ? 20 : 24} />}
            </Box>
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box position={'relative'}>
            {iAmFreeToday ? (
              isFavourite ? (
                <Chip
                  label={babeData?.gonow_servce === ServiceTypeEnum.meetup ? babeData?.gonow_coming_from : 'Town'}
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    top: 8,
                    left: 8,
                    p: '0 8px',
                    backdropFilter: 'blur(10px)',
                    color: '#FFF',
                    fontSize: size === 'small' ? 12 : 14,
                    lineHeight: size === 'small' ? 16 : 20,
                    zIndex: 1,
                  }}
                  icon={
                    isFavourite ? (
                      <LocationIcon size={size === 'small' ? 16 : 20} />
                    ) : (
                      <Lighting size={size === 'small' ? 16 : 20} />
                    )
                  }
                  size={size}
                />
              ) : (
                <Chip
                  label={isFavourite ? babeData?.location : 'Available today!'}
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    top: 8,
                    left: 8,
                    p: '0 8px',
                    backdropFilter: 'blur(10px)',
                    color: '#FFF',
                    fontSize: size === 'small' ? 12 : 14,
                    lineHeight: size === 'small' ? 16 : 20,
                    zIndex: 1,
                  }}
                  icon={
                    isFavourite ? (
                      <LocationIcon size={size === 'small' ? 16 : 20} />
                    ) : (
                      <Lighting size={size === 'small' ? 16 : 20} />
                    )
                  }
                  size={size}
                />
              )
            ) : (
              ''
            )}
            {/* {babeData?.video_urls?.length > 0 ? (
              <video
                id={`video-${babeData?.uid}`}
                src={babeData?.video_urls?.[0]}
                height={size === 'small' ? 180 : 240}
                // width={size === 'small' ? 157 : 240}
                width={'100%'}
                autoPlay
                playsInline
                muted
                loop
                style={{
                  objectFit: 'cover',
                  borderRadius: '16px',
                  objectPosition: 'center center',
                }}
              />
            ) : ( */}
            <Box position="relative" width="100%" height={size === 'small' ? 180 : 240}>
              <NextImage
                src={babeData?.urls?.[0] || babeData?.mobileUrl}
                fill
                sizes="100%"
                style={{ borderRadius: 16, objectFit: 'cover' }}
                alt={babeData?.nickname || babeData?.nick || '-'}
              />
            </Box>
            {/* )} */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '-20px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                p: '0 8px',
              }}
            >
              <Avatar
                avatars={servicesList}
                total={servicesList?.length}
                max={size === 'small' ? 2 : 4}
                sx={{
                  background: '#FFF',
                  boxShadow: '0px 2px 14px 0px rgba(0, 0, 0, 0.10)',
                  '.MuiAvatar-img': {
                    width: isLive ? '36px' : '24px',
                    height: isLive ? '36px' : '24px',
                    borderRadius: '100px',
                  },
                }}
                renderSurplus={(surplus) => (
                  <span>
                    <FireBlack size={isLive ? 36 : 24} />
                    <Box
                      sx={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        fontSize: '14px',
                        fontWeight: '400',
                      }}
                    >
                      <span>+{surplus}</span>
                    </Box>
                  </span>
                )}
              />
              {babeData?.voiceUrl && <VoiceButtom voiceUrl={babeData.voiceUrl} />}
            </Box>
          </Box>
          <Box p={2} display="flex" alignItems="flex-start" gap={2} flexDirection="column">
            {isFavourite && <Time from={fromTime} to={endTime} size={size} />}
            <Rating ratingData={babeData?.ratings} size={size} />
            {!isFavourite && (
              <Price
                priceData={{
                  price: priceObj?.price,
                  min: priceObj?.minPrice,
                  max: priceObj?.maxPrice,
                  hr: ServiceHelper.getFirstServiceSuffix(babeData?.services),
                  // decimalPoint: decimalPoint
                }}
                size={size}
                category={category || servicesList?.length === 1 ? '1' : ''}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BabeCard;
