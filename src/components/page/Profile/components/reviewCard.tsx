import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Typography from '@/components/atoms/typography';
import Rating from '@/components/molecules/ratings';
import { useGetUserData } from '@/hooks/useGetUserData';
import { mobileUrlKey, nicknameKey } from '@/keys/firestoreKeys';
import { ServiceDetails } from '@/props/servicesProps';
import { Helper } from '@/utility/helper';
import { grey, red } from '@mui/material/colors';
import { Timestamp } from 'firebase/firestore';
// import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React, { memo } from 'react';

interface IReviewCard {
  senderId: string | undefined;
  isAnnon: boolean;
  numberOfStars: number;
  reviewData: any;
}

// eslint-disable-next-line react/display-name
const ReviewCard = memo(({ senderId, isAnnon, numberOfStars, reviewData }: IReviewCard) => {
  const { data: userData } = useGetUserData(senderId);
  const date = (reviewData?.t as Timestamp | undefined)?.toDate();
  const servicesObj = reviewData?.services as ServiceDetails | undefined;
  const serviceTitle = servicesObj?.details?.title;
  const title = serviceTitle ? `Service: ${serviceTitle}` : '';
  const nickName = userData?.get(nicknameKey);
  const comments = reviewData?.cmts || "The user didn't write a review and has left just a rating.";
  const firstLetter = isAnnon ? 'A' : nickName ? nickName[0] : '-';

  return (
    <Box display={'flex'} gap={'14px'} maxWidth={'552px'}>
      <Box width={40} height={40}>
        <Avatar
          sx={{
            bgcolor: isAnnon ? red[500] : grey[500],
            color: '#fff',
          }}
          avatars={[{ src: isAnnon ? firstLetter : userData?.get(mobileUrlKey) || '-', alt: firstLetter || '-' }]}
        />
      </Box>
      <Box>
        <Typography variant="body2" fontWeight={500} color={'#646464'}>
          {isAnnon ? 'Anonymous' : nickName || '-'}
        </Typography>
        <Box display={'flex'} gap={'8px'} alignItems={'center'}>
          <Rating readOnly ratingData={numberOfStars} value={numberOfStars} max={5} size="small" />
          <DotIcon />
          <Typography variant="body2" color={'#646464'}>
            {date && Helper.timeSince(date, true)}
          </Typography>
        </Box>
        <Box paddingTop={4}>
          <Typography variant="body2" fontWeight={500} color={'#1A1A1A'}>
            {title}
          </Typography>
          <Typography variant="body2" color={'#646464'}>
            {comments}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default ReviewCard;
