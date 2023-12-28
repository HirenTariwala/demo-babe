import Box from '@/components/atoms/box';
import { db } from '@/credentials/firebase';
import { REVIEWS, USERS, uidKeyKey, completedKey, PUBLIC, viewsKey } from '@/keys/firestoreKeys';
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
import useVoiceHook from '@/components/molecules/card/babe/useVoiceHook';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { useGetAudioDuration } from '@/hooks/useGetAudioDuration';
import { CalculatorHelper } from '@/utility/calculator';
import Slider from 'react-slick';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/reducers/usersReducer';

const settings = {
  dots: false,
  slidesToShow: 5.1,
  slidesToScroll: 1,
  infinite: true,

  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3.7,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const initReviewLimit: number = 20;
const useProfileHook = (uid: string | undefined, babeInfo: any) => {
  const id = uid || babeInfo?.uid;
  const isMobile = useMediaQuery('(max-width:600px)');
  const [item, setItem] = useState<Item>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [duration, setDuration] = useState<number | null>(0);
  const { voiceOnClick, isAudioPlaying } = useVoiceHook({ voiceUrl: item?.voiceUrl });
  const [hasMoreReview, setHasMoreReview] = useState(true);
  const [reviewLimit, setReviewLimit] = useState(initReviewLimit);
  const [viewCount, setViewCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const pathName = usePathname();
  const router = useRouter();
  const t = useTranslations('profile.serviceTab');
  const cal = CalculatorHelper;

  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  const [myUid] = [currentUser?.uid];

  useGetAudioDuration(item?.voiceUrl, (d) => {
    setDuration(Math?.ceil(d));
  });

  const onResetTab = () => {
    setActiveTab(0);
  };

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
          lable: () => getTitle(newValue),
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
      content:
        item?.urls && item?.urls?.length > 0 ? (
          isMobile ? (
            <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
              {item?.urls.map((url, index) => {
                return (
                  <Box key={index} width={'160px'} height={'160px'} position={'relative'}>
                    <NextImage
                      key={index}
                      src={url}
                      alt="image"
                      style={{ borderRadius: '12px' }}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box>
              <Slider {...settings}>
                {item?.urls?.map((url, index) => {
                  return (
                    <Box key={index}>
                      <Box width="160px" height="160px" position="relative">
                        <NextImage
                          key={index}
                          src={url}
                          layout="fill"
                          alt="image"
                          objectFit="cover"
                          style={{ borderRadius: '12px' }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Slider>
            </Box>
          )
        ) : (
          <Typography variant="body1" color={'#646464'}>
            Empty Gallery photos
          </Typography>
        ),
      lable: () => 'Gallery',
    },
    {
      content: (
        <Typography variant="body1" color={'#646464'}>
          Empty Insta photos
        </Typography>
      ),
      lable: () => 'Recent Insta photos',
    },
    {
      lable: () => 'Reviews',
      content: (
        <InfiniteScroll
          dataLength={reviews?.length}
          next={fetchMoreReview}
          hasMore={hasMoreReview}
          style={{
            overflow: 'inherit',
          }}
          loader={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={18} />
            </Box>
          }
        >
          <Box display={'flex'} flexDirection={'column'} gap={3}>
            {reviews?.length > 0 ? (
              reviews?.map((review, index) => {
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
      ),
    },
  ];

  const getViewData = async () => {
    // Get View Count
    const queryUid = id;
    let newViews = 0;
    const promises = [
      getDocs(collection(db, PUBLIC, queryUid, viewsKey)).then((docs) => {
        docs.forEach((doc) => {
          const views = doc.get(viewsKey) as number;
          if (views !== undefined && views !== null) {
            newViews += views;
          }
        });
        setViewCount(newViews);
      }),
    ];

    Promise.all(promises);
  };
  useEffect(() => {
    if (pathName.includes('profile') && !babeInfo) {
      getViewData();
      getDocs(query(collection(db, USERS), where(uidKeyKey, '==', id)))
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
    } else {
      setItem(babeInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (uid || babeInfo.uid) {
      getDocs(
        query(collection(db, REVIEWS), limit(reviewLimit), where(completedKey, '==', true), where(uidKeyKey, '==', id))
      )
        .then((snapshot) => {
          const docs = snapshot.docs;
          setReviews(docs ?? []);

          if (docs?.length === reviews?.length) {
            setHasMoreReview(false);
          }

          if (docs?.length < reviewLimit) {
            setHasMoreReview(false);
          }
        })
        .catch((error) => {
          console.log('reviewGet error: ' + error);

          setHasMoreReview(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewLimit, id]);

  const handleClose = (text: any) => {
    if (text?.props.children === 'Share') {
      setShareModalOpen(true);
    } else if (text?.props.children === 'Report') {
      if (!myUid) {
        router.push('/login');
        return;
      }
      setReportModalOpen(true);
    }
    setAnchorEl(null);
  };

  const url = item?.mobileUrl || item?.urls?.[0];
  const milliseconds = item?.time_stamp
    ? item?.time_stamp?.seconds * 1000 + Math.floor(item?.time_stamp?.nanoseconds / 1e6)
    : '';

  const dateTime = Helper.timeSince(new Date(milliseconds))?.toLowerCase();

  const goBack = () => {
    history.back();
  };

  return {
    isMobile,
    item,
    galleryData,
    tabsData,
    url,
    myUid,
    dateTime,
    open,
    anchorEl,
    shareModalOpen,
    duration,
    isAudioPlaying,
    reportModalOpen,
    view: cal?.viewFormat(viewCount),
    voiceOnClick,
    setAnchorEl,
    setShareModalOpen,
    handleClose,
    goBack,
    onResetTab,
    setReportModalOpen,
  };
};

export default useProfileHook;
