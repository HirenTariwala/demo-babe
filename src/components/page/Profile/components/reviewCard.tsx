import Skeleton from '@/components/atoms/Skeleton';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Typography from '@/components/atoms/typography';
import Rating from '@/components/molecules/ratings';
import { VariableWindowListContext } from '@/components/organisms/list/VariableWindowList';
import { useGetUserData } from '@/hooks/useGetUserData';
import { mobileUrlKey, nicknameKey } from '@/keys/firestoreKeys';
import { ReviewsProps } from '@/props/commonProps';
import { ServiceDetails } from '@/props/servicesProps';
import { Helper } from '@/utility/helper';
import { Card, CardHeader, DialogContent } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import React, { memo, useContext, useEffect } from 'react';
import { ListChildComponentProps } from 'react-window';

const ReviewSkeletonCard = () => {
  return (
    <Box padding={2}>
      <Card elevation={0} sx={{ borderRadius: 0 }}>
        <CardHeader
          avatar={<Skeleton sx={{ height: 40, width: 40 }} variant="circular" />}
          title={<Skeleton width={200} variant="text" />}
          subheader={<Skeleton width={80} variant="text" />}
        />

        <DialogContent sx={{ padding: '0 1em 0 72px' }}>
          <Skeleton width="90%" height={50} variant="text" />
        </DialogContent>
      </Card>
    </Box>
  );
};

const ReviewCard = (hasNextPage: boolean) =>
  // eslint-disable-next-line react/display-name
  memo(({ index, style, data }: ListChildComponentProps<QueryDocumentSnapshot<DocumentData>[] | undefined>) => {
    const { size, setSize } = useContext(VariableWindowListContext);
    const numberOfDocs = data?.length ?? 0;
    const review = data?.[index];
    const docId = review?.id;
    const reviewData = review?.data() as ReviewsProps;
    const senderId: string = reviewData?.sen || '';
    const isAnnon = reviewData?.annon;
    const ratings1 = (reviewData?.rts as number | undefined) ?? 0;
    const ratings2 = reviewData?.rts2 as number | undefined;
    const numberOfStars = ratings2 ?? (ratings1 > 4 ? 4 : ratings1) + 1;

    const { data: userData } = useGetUserData(senderId);
    const date = (reviewData?.t as Timestamp | undefined)?.toDate();
    const servicesObj = reviewData?.services as ServiceDetails | undefined;
    const serviceTitle = servicesObj?.details?.title;
    const title = serviceTitle ? `Service: ${serviceTitle}` : '';
    const nickName = userData?.get(nicknameKey);
    const comments = reviewData?.cmts || "The user didn't write a review and has left just a rating.";
    const firstLetter = isAnnon ? 'A' : nickName ? nickName[0] : '-';

    useEffect(() => {
      const root = document.getElementById(index?.toString());
      const height = root?.getBoundingClientRect().height ?? 0;

      setSize?.(index, height);
    }, [size?.width]);

    if (!reviewData || !docId) {
      return hasNextPage ? (
        <Box key={index} style={style}>
          <ReviewSkeletonCard />
          <br />
          {numberOfDocs === 0 && (
            <>
              <ReviewSkeletonCard />
              <br />
              <ReviewSkeletonCard />
              <br />
              <ReviewSkeletonCard />
              <br />
              <ReviewSkeletonCard />
              <br />
            </>
          )}
        </Box>
      ) : null;
    } else
      return (
        <Box
          key={index}
          style={style}
          sx={{
            marginTop: `${index * 12}px`,
          }}
        >
          <Box id={index?.toString()} display={'flex'} gap={'14px'} maxWidth={'552px'}>
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
        </Box>
      );
  });

export default ReviewCard;
