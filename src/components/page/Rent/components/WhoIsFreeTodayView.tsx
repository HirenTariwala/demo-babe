import Box from '@/components/atoms/box';
import NextImage from '@/components/atoms/image';
import Typography from '@/components/atoms/typography';
import BabeCard from '@/components/molecules/card/babe';
import { db } from '@/credentials/firebase';
import { USERS, adminKey, clubKey, endKey, geoEncodingsKey } from '@/keys/firestoreKeys';
import { Item } from '@/props/profileProps';
import { Helper } from '@/utility/helper';
import { Timestamp, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../rent.module.css';

const settings = {
  dots: false,
  slidesToShow: 5,
  slidesToScroll: 1,
  infinite: true,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        // dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1.7,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.7,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
  ],
};
interface INextButton {
  image: string;
  onClick: () => void;
}

const NextButton = ({ image, onClick }: INextButton) => {
  const buttonSize = 32;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#00000095"
      borderRadius={99_999_999}
      height={buttonSize}
      width={buttonSize}
      sx={{
        backdropFilter: 'blur(5px)',
        padding: '8px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <NextImage src={image} height={buttonSize / 2} width={buttonSize / 2} alt="" />
    </Box>
  );
};

interface props {
  initLoading: boolean;
  isMobile: boolean;
  regionState: string[];
  handlePrev: () => void;
  handleNext: () => void;
  sliderRef: any;
  onClickBabeCard: (e: React.MouseEvent<Element, MouseEvent>, obj: Item) => void;
  //   uid: string | null | undefined;
  //   isAdminPage: boolean;
  //   openProfile: (item: Item) => void;
}
sessionStorage.setItem('WhoIsFreeTodayView', '[]');

const WhoIsFreeTodayView = ({
  isMobile,
  handlePrev,
  handleNext,
  regionState,
  sliderRef,
  onClickBabeCard,
}:props) => {
  const WhoIsFreeTodayData = sessionStorage.getItem('WhoIsFreeTodayView');
  const [goNow, setGoNow] = useState<Item[]>(WhoIsFreeTodayData ? JSON.parse(WhoIsFreeTodayData) : []);
  const [numberOfProfilesTODAY, setNumberOfProfilesTODAY] = useState<number>(
    WhoIsFreeTodayData ? JSON.parse(WhoIsFreeTodayData)?.length : NaN
  );
  const now = new Date();
  const midnight = useRef<Date>(new Date(now));
  const today = useRef<Date>(new Date(now));

  const NOTannouncementSession = Helper.getQueryStringValue('session') === '';

  const TODAYLimit = Math.ceil(window.innerWidth / (120 + 16)) + 2;

  const clubName = sessionStorage.getItem(clubKey);
  const refreshingTODAY = useRef<boolean>(false);

  useEffect(() => {
    refreshingTODAY.current = false;
    // eslint-disable-next-line
  }, [goNow]);

  async function getTODAY(states: string[]) {
    if (refreshingTODAY.current || clubName || states.length === 0) {
      return;
    }
    refreshingTODAY.current = true;

    const goNowItems: Item[] = goNow;
    const state = states[states.length - 1];

    const docRef = query(
      collection(db, USERS),
      where(geoEncodingsKey, 'array-contains', state),
      where(adminKey, '==', true),
      where(endKey, '>', Timestamp.fromDate(today.current)),
      where(endKey, '<', Timestamp.fromDate(midnight.current)),
      limit(TODAYLimit),
      orderBy(endKey, 'asc')
    );

    const snap = await getDocs(docRef);

    for (const doc of snap.docs) {
      const item = Helper.createItemFromDocument(doc);
      goNowItems.push(item as Item);
    }

    const lastDoc = snap?.docs?.slice(-1)[0];
    if (lastDoc) {
      today.current = (lastDoc?.get(endKey) as Timestamp).toDate();
    }
    const numberOfProfiles = snap.docs.length;
    if (numberOfProfiles !== 0 && goNowItems?.length >= goNow?.length) {
      setGoNow([...goNowItems]);
      sessionStorage.setItem('WhoIsFreeTodayView', JSON.stringify(goNowItems));
      setNumberOfProfilesTODAY(goNowItems?.length);
    }
  }

  useEffect(() => {
    Helper.setTodayMidnightHours(midnight.current);
    if (NOTannouncementSession) {
      getTODAY(regionState);
    }
    // eslint-disable-next-line
  }, [regionState]);

  const availableProfileLabel = numberOfProfilesTODAY
    ? numberOfProfilesTODAY == 1
      ? `${numberOfProfilesTODAY} profile is available TODAY 🔥`
      : `${numberOfProfilesTODAY} profiles are available TODAY 🔥`
    : 'Available TODAY 🔥';

  return numberOfProfilesTODAY > 0 ? (
    <Box className={`${styles.availableProfile}`}>
      <Box className={styles.favouriteLabel} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        {/* {initLoading ? (
            <SkeletonLine height={30} width={'50%'} />
          ) : ( */}
        <Typography color="#1A1A1A" component="span" variant={isMobile ? 'h4' : 'h2'} whiteSpace={'nowrap'}>
          {availableProfileLabel}
        </Typography>
        {/* )} */}
        {!isMobile && (
          <Box display={'flex'} gap={2} alignItems={'center'}>
            {/* {initLoading ? (
                <SkeletonAvatar width={26} height={26} />
              ) : ( */}
            <NextButton
              image={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/arrow_back_ios.svg`}
              onClick={handlePrev}
            />
            {/* )} */}

            {/* {initLoading ? (
                <SkeletonAvatar width={26} height={26} />
              ) : ( */}
            <NextButton
              image={`https://${process.env.NEXT_PUBLIC_IMAGE_PREFIX}/assets/mui/arrow_forward_ios.svg`}
              onClick={handleNext}
            />
            {/* )} */}
          </Box>
        )}
      </Box>
      <Box className={styles.sliderBox}>
        <Slider {...settings} ref={sliderRef}>
          {goNow?.map((item, index) => {
            return (
              <Box key={index} maxWidth={256} minWidth={196} width={isMobile ? 200 : '100%'}>
                <BabeCard
                  key={index}
                  babeData={item}
                  isFavourite={true}
                  size={isMobile ? 'small' : 'medium'}
                  onClickHandler={(e, uid) => onClickBabeCard(e, uid)}
                />
              </Box>
            );
          })}
        </Slider>
      </Box>
    </Box>
  ) : (
    <Box paddingBottom={10} />
  );
};

export default WhoIsFreeTodayView;
