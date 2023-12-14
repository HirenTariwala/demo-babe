import Box from '@/components/atoms/box';
import { db } from '@/credentials/firebase';
import { REVIEWS, USERS, uidKeyKey, completedKey } from '@/keys/firestoreKeys';
import { Item } from '@/props/profileProps';
import { ServiceTypeEnum } from '@/props/servicesProps';
import { Helper } from '@/utility/helper';
import { DocumentData, QueryDocumentSnapshot, collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import TabContent from './components/tabContent';
import NextImage from '@/components/atoms/image';
import ReviewCard from './components/reviewCard';
import Typography from '@/components/atoms/typography';
import useRentHook from '../Rent/useRentHook';
import { useRouter } from 'next/navigation';
import useVoiceHook from '@/components/molecules/card/babe/useVoiceHook';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

const initReviewLimit: number = 10;
const useProfileHook = (uid: string) => {
  const router = useRouter();
  const { isMobile } = useRentHook();
  const [item, setItem] = useState<Item>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [duration] = useState<number | null>(0);
  const { voiceOnClick, isAudioPlaying } = useVoiceHook({ voiceUrl: item?.voiceUrl });
  const [hasMoreReview, setHasMoreReview] = useState(true);
  const [reviewLimit, setReviewLimit] = useState(initReviewLimit);

  const t = useTranslations('profile.serviceTab');

  // useEffect(() => {
  //   if (item?.voiceUrl) {
  //     console.log(item?.voiceUrl);

  //     const audioUrl = item?.voiceUrl;
  //     const audio = new Audio(audioUrl);

  //     const handleLoadedMetadata = () => {
  //       const audioDuration = audio.duration;
  //       console.log(audioDuration);

  //       setDuration(audioDuration);
  //     };

  //     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
  //     return () => {
  //       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
  //     };
  //   }
  // }, [item]);

  const tabsData: any[] = [];
  if (item?.services) {
    Object.entries(item?.services)
      .sort()
      .map((value) => {
        const data = value[1];
        delete data['id'];
        // const isEmpty = Object.values(data).length === 0;
        const newValue = parseInt(value[0]);
        tabsData.push({
          lable: getTitle(newValue),
          content: (
            <TabContent
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              data={data}
              babeInfo={item}
              isMobile={isMobile}
            />
          ),
        });
      });
  }

  function getTitle(value: number): string {
    switch (value) {
      case ServiceTypeEnum.meetup:
        return `${t('meetup')}`; //"Meetup"
      case ServiceTypeEnum.eMeet:
        return `${t('emeet')}`; // "EMeet";
      case ServiceTypeEnum.games:
        return `${t('games')}`; // "Games";
      case ServiceTypeEnum.sports:
        return `${t('sports')}`; // "Games";
      default:
        return `${t('meetup')}`; // "Meetup"
    }
  }

  const fetchMoreReview = () => {
    setReviewLimit((prev) => prev + initReviewLimit);
  };

  const galleryData = [
    {
      content: (
        <Box display="flex" gap={3} flexWrap="wrap">
          {item?.urls.map((url, index) => (
            <Box key={index} width={'160px'} height={'160px'}>
              <NextImage key={index} src={url} alt="image" width={160} style={{ borderRadius: '12px' }} height={160} />
            </Box>
          ))}
        </Box>
      ),
      lable: 'Gallery',
    },
    {
      content: (
        <Typography variant="body1" color={'#646464'}>
          Empty Insta photos
        </Typography>
      ),
      lable: 'Recent Insta photos',
    },
    {
      lable: 'Reviews',
      content: (
        <InfiniteScroll
          dataLength={reviews?.length}
          next={fetchMoreReview}
          hasMore={hasMoreReview}
          style={{
            overflow: "inherit"
          }}
          loader={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={18} />
            </Box>
          }
        >
          <Box display={'flex'} flexDirection={'column'} gap={3}>
            {reviews?.length > 0 ? (
              reviews.map((review, index) => {
                const reviewData = review?.data();
                const senderId: string = reviewData?.sen;
                const isAnnon = reviewData?.annon;
                const ratings1 = (reviewData?.rts as number | undefined) ?? 0;
                const ratings2 = reviewData?.rts2 as number | undefined;
                const numberOfStars = ratings2 ?? (ratings1 > 4 ? 4 : ratings1) + 1;

                return (
                  <ReviewCard
                    key={index}
                    isAnnon={isAnnon}
                    numberOfStars={numberOfStars}
                    reviewData={reviewData}
                    senderId={senderId}
                  />
                );
              })
            ) : (
              <Typography variant="body1" color={'#646464'}>
                Empty Review
              </Typography>
            )}
          </Box>
        </InfiniteScroll>
        // <Box display={'flex'} flexDirection={'column'} gap={3}>
        //   {reviews?.length > 0 ? (
        //     reviews.map((review, index) => {
        //       const reviewData = review?.data();
        //       const senderId: string = reviewData?.sen;
        //       const isAnnon = reviewData?.annon;
        //       const ratings1 = (reviewData?.rts as number | undefined) ?? 0;
        //       const ratings2 = reviewData?.rts2 as number | undefined;
        //       const numberOfStars = ratings2 ?? (ratings1 > 4 ? 4 : ratings1) + 1;

        //       return (
        //         <ReviewCard
        //           key={index}
        //           isAnnon={isAnnon}
        //           numberOfStars={numberOfStars}
        //           reviewData={reviewData}
        //           senderId={senderId}
        //         />
        //       );
        //     })
        //   ) : (
        //     <Typography variant="body1" color={'#646464'}>
        //       Empty Review
        //     </Typography>
        //   )}
        // </Box>
      ),
    },
  ];

  useEffect(() => {
    if (uid) {
      getDocs(query(collection(db, USERS), where(uidKeyKey, '==', uid)))
        .then((snapshot) => {
          if (snapshot.docs.length !== 0) {
            const doc = snapshot.docs[0];
            const item = Helper.createItemFromDocument(doc);

            setItem(item);
          }
        })
        .catch((error) => {
          console.log('user get error: ', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (uid) {
      getDocs(
        query(collection(db, REVIEWS), limit(reviewLimit), where(completedKey, '==', true), where(uidKeyKey, '==', uid))
      )
        .then((snapshot) => {
          const docs = snapshot.docs;
          setReviews(docs ?? []);
          if (docs?.length === reviews?.length) {
            setHasMoreReview(false);
          }
        })
        .catch((error) => {
          console.log('reviewGet error: ' + error);

          setHasMoreReview(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewLimit, uid]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClose = (text: any) => {
    if (text?.props.children === 'Share') {
      setShareModalOpen(true);
    }
  };

  const url = item?.mobileUrl || item?.urls?.[0];
  const milliseconds = item?.time_stamp
    ? item?.time_stamp?.seconds * 1000 + Math.floor(item?.time_stamp?.nanoseconds / 1e6)
    : '';

  const dateTime = Helper.timeSince(new Date(milliseconds))?.toLowerCase();

  const goBack = () => {
    router.back();
  };

  return {
    isMobile,
    item,
    galleryData,
    tabsData,
    url,
    dateTime,
    open,
    anchorEl,
    shareModalOpen,
    duration,
    isAudioPlaying,
    voiceOnClick,
    setAnchorEl,
    setShareModalOpen,
    handleClose,
    goBack,
  };
};

export default useProfileHook;
