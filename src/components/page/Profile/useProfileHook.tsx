import Box from '@/components/atoms/box';
import { db } from '@/credentials/firebase';
import { REVIEWS, USERS, uidKey, completedKey, PUBLIC, viewsKey, timeStampKey } from '@/keys/firestoreKeys';
import { Item } from '@/props/profileProps';
import { ServiceTypeEnum } from '@/props/servicesProps';
import { Helper } from '@/utility/helper';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import TabContent from './components/tabContent';
import NextImage from '@/components/atoms/image';
import ReviewCard from './components/reviewCard';
import Typography from '@/components/atoms/typography';
import { useMediaQuery } from '@mui/material';
import { CalculatorHelper } from '@/utility/calculator';
import Slider from 'react-slick';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/reducers/usersReducer';
import { useSeletedBabeStore } from '@/store/reducers/babeReducer';
import VariableWindowList from '@/components/organisms/list/VariableWindowList';
import styles from './profile.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const initReviewLimit: number = 20;
const useProfileHook = (uid: string | undefined) => {
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
  const { selectedBabe } = useSeletedBabeStore();
  const selectedBabeUid = selectedBabe?.uid;

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const [item, setItem] = useState<Item>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [hasMoreReview, setHasMoreReview] = useState(true);
  const [reviewLimit, setReviewLimit] = useState(initReviewLimit);
  const [viewCount, setViewCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const pathName = usePathname();
  const isProfilePage = pathName?.includes('profile');
  const router = useRouter();
  const t = useTranslations('profile.serviceTab');
  const v = useTranslations('profile.modal');
  const cal = CalculatorHelper;

  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;
  const [myUid] = [currentUser?.uid];

  const onResetTab = () => {
    setActiveTab(0);
  };

  const getTitle = (value: number): { label: string; keyValue: ServiceTypeEnum} => {
    switch (value) {
      case ServiceTypeEnum.meetup:
        return { label: `${t('meetup')}`, keyValue: ServiceTypeEnum.meetup }; //"Meetup"
      case ServiceTypeEnum.eMeet:
        return { label: `${t('emeet')}`, keyValue: ServiceTypeEnum.eMeet }; // "EMeet";
      case ServiceTypeEnum.games:
        return { label: `${t('games')}`, keyValue: ServiceTypeEnum.games }; // "Games";
      case ServiceTypeEnum.sports:
        return { label: `${t('sports')}`, keyValue: ServiceTypeEnum.sports }; // "Games";
      default:
        return { label: `${t('meetup')}`, keyValue: ServiceTypeEnum.meetup }; // "Meetup"
    }
  };

  const tabsData: any[] = [];
  if (item?.services) {
    Object.entries(item?.services)
      .sort()
      .map((value) => {
        const data = value[1];
        const newValue = parseInt(value[0]);
        const {label,keyValue} = getTitle(newValue);
        tabsData.push({
          lable: () => label,
          content: (
            <TabContent
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              data={data}
              isMobile={isMobile}
              serviceType={keyValue}
            />
          ),
        });
      });
  }


  const fetchMoreReview = () => {
    setReviewLimit((prev) => prev + initReviewLimit);
  };

  const galleryData = [
    {
      content:
        item?.urls && item?.urls?.length > 0 ? (
          isProfilePage ? (
            <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
              {item?.urls?.map((url, index) => {
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
              <Slider {...settings} className={styles.slider}>
                {item?.urls?.map((url, index) => {
                  return (
                    <Box key={index}>
                      <Box width="160px" height="160px" position="relative">
                        <NextImage
                          key={index}
                          src={url}
                          fill
                          alt="image"
                          style={{ borderRadius: '12px', objectFit: 'cover' }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Slider>
            </Box>
          )
        ) : (
          <Typography minHeight={isProfilePage ? '500px' : '168px'} variant="body1" color={'#646464'}>
            Empty Gallery photos
          </Typography>
        ),
      lable: () => v('gallery'),
    },
    {
      content: (
        <Typography minHeight={isProfilePage ? '500px' : '168px'} variant="body1" color={'#646464'}>
          Empty Insta photos
        </Typography>
      ),
      lable: () => v('insta'),
    },
    {
      lable: () => v('review'),
      content:
        reviews?.length > 0 ? (
          <Box position="relative" className={styles.reviewList}>
            <VariableWindowList
              data={reviews ?? []}
              height={(window?.innerHeight / 3) * 4}
              width={'100%'}
              hasNextPage={hasMoreReview}
              loadNextPage={fetchMoreReview}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignores
              component={ReviewCard(hasMoreReview)}
            />
          </Box>
        ) : (
          <Typography minHeight={isProfilePage ? '500px' : '168px'} variant="body1" color={'#646464'}>
            Empty Reviews
          </Typography>
        ),
    },
  ];

  const getViewData = async () => {
    // Get View Count
    const queryUid = selectedBabeUid || uid || '';

    let newViews = 0;
    const promises = [
      getDocs(collection(db, PUBLIC, queryUid, viewsKey)).then((docs) => {
        docs?.forEach((doc) => {
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
    getViewData();
    if (pathName.includes('profile') && !selectedBabeUid) {
      getDocs(query(collection(db, USERS), where(uidKey, '==', uid)))
        .then((snapshot) => {
          if (snapshot?.docs?.length !== 0) {
            const doc = snapshot?.docs[0];
            const item = Helper?.createItemFromDocument(doc);
            setItem(item);
          }
        })
        .catch((error) => {
          console.log('user get error: ', error);
        });
    } else {
      setItem(selectedBabe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (uid || selectedBabeUid) {
      getDocs(
        query(
          collection(db, REVIEWS),
          where(completedKey, '==', true),
          where(uidKey, '==', selectedBabeUid || uid),
          orderBy(timeStampKey, 'desc'),
          limit(reviewLimit)
        )
      )
        .then((snapshot) => {
          const docs = snapshot?.docs;
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
  }, [reviewLimit, selectedBabeUid]);

  const handleClose = (text: number) => {
    if (text === 1) {
      setShareModalOpen(true);
    } else if (text === 2) {
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
    router?.push('/rent');
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const nickName = item?.nickname || item?.nick || '--';

  const fetchInstaPhotos = async () => {
    try {
      const response = await fetch(
        `https://graph.instagram.com/${item?.isgUid}/media?fields=id,media_type,media_url&access_token=${item?.isgToken}`,
        {
          method: 'GET',
        }
      );
      if (response.ok) {
        console.log('res', response);
        const jsonResponse = await response.json();
        const medias = jsonResponse.data.map((media: any) => ({
          id: media.id,
          image: media.images.standard_resolution.url,
        }));
        console.log('mediasss', medias);
        return medias;
      }
      throw new Error('Request failed!');
    } catch (error) {
      console.log('errrrr', error);
    }
  };

  useEffect(() => {
    if (item && item.isgToken) {
      fetchInstaPhotos();
    }
  }, [item]);

  return {
    isMobile,
    item,
    nickName,
    galleryData,
    tabsData,
    url,
    myUid,
    dateTime,
    open,
    anchorEl,
    shareModalOpen,
    isTablet,
    reportModalOpen,
    view: cal?.viewFormat(viewCount),
    router,
    isProfilePage,
    setAnchorEl,
    setShareModalOpen,
    handleClose,
    goBack,
    onResetTab,
    setReportModalOpen,
  };
};

export default useProfileHook;
