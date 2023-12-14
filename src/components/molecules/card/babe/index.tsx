import React from 'react';
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

interface IBabeCard extends CardProps {
  babeData: any;
  size?: 'small' | 'medium';
  isFavourite?: boolean;
  category?: string;
  categoryTitle?: string;
  categoryObj?: any;
  favouritesV2?: any;
}

const BabeCard = ({
  babeData,
  size,
  isFavourite,
  category,
  categoryTitle,
  categoryObj,
  favouritesV2,
  ...props
}: IBabeCard) => {
  // const {
  //   // nickname,
  //   // isOnline,
  //   videoVerification,
  //   // visible,
  //   video_urls,
  //   voiceUrl,
  //   ratings,
  //   price,
  //   location,
  //   uid,
  //   services,
  //   end,
  //   isgToken,
  //   urls,
  //   // sbyprt,
  //   mobileUrl,
  // } = babeData;
  const allServicesArr = useServicesStore();
  // const {voiceOnClick} = useVoiceButtom()
  const iAmFreeToday = babeData?.end ? Helper.amIFreeToday(Timestamp.fromDate(babeData?.end)) : false;
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

  // if(babeData?.nickname === "yokookie") {
  //   // const temp1 = Object.values(babeData?.services).map((item: any) => Object.values(item)?.[0]);
  //   console.log(babeData,servicesList)
  // }

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
    >
      <Box sx={{ width: '100%', height: '100%', zIndex: 9, position: 'absolute' }} {...props}></Box>
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
              <Typography variant="h4" fontSize={size === 'small' ? 16 : 18}>
                {babeData?.nickname || '-'}
              </Typography>
              {babeData?.isOnline && <StatusDot />}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {babeData?.videoVerification && <Verifed size={size === 'small' ? 20 : 24} />}
              {babeData?.isgToken && <SocialIcon size={size === 'small' ? 20 : 24} />}
            </Box>
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box position={'relative'}>
            {iAmFreeToday && (
              // || location
              <Chip
                label={babeData?.isFavourite ? babeData?.location : 'Available today!'}
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
              {/* <Image
                  src={babeData?.urls?.[0] || babeData?.mobileUrl}
                  // layout="fill"
                  fill
                  // loading='lazy'
                  sizes='100%'
                  style={{ borderRadius: 16, objectFit: 'cover' }}
                  alt={babeData?.nickname || '-'}
                /> */}
              <NextImage
                src={babeData?.urls?.[0] || babeData?.mobileUrl}
                fill
                sizes="100%"
                style={{ borderRadius: 16, objectFit: 'cover' }}
                alt={babeData?.nickname || '-'}
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
                }}
                renderSurplus={(surplus) => (
                  <span>
                    <FireBlack />
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
              {babeData?.voiceUrl && (
                <VoiceButtom voiceUrl={babeData.voiceUrl} />
                // <IconButton
                //   onClick={() => {
                //     console.log('Hello');
                //     voiceOnClick(babeData?.voiceUrl)
                //   }}
                //   sx={{
                //     background: '#FFD443',
                //     zIndex: 10,
                //     border: '2px solid #FFF',
                //     ':hover': { background: '#FFD443' },
                //   }}
                // >
                //   <VoiceIcon />
                // </IconButton>
              )}
            </Box>
          </Box>
          <Box p={2} display="flex" alignItems="flex-start" gap={2} flexDirection="column">
            {isFavourite && <Time from={'10:58 AM'} to={'4:58 PM'} size={size} />}
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
