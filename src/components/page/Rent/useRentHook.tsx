'use client';
import { mediaLinks } from '@/common/utils/data';
import Typography from '@/components/atoms/typography';
import BabeCard from '@/components/molecules/card/babe';
import { db } from '@/credentials/firebase';
import { useGetFavourites } from '@/hooks/useGetFavouties';
import {
  USERS,
  adminKey,
  genderKey,
  geoEncodings,
  lowestKey,
  nicknameKey,
  privacyKey,
  raceKey,
  servicesKey,
  sortByPricingKey,
  sortByRatingsKey,
  stateKey,
  timeStampKey,
} from '@/keys/firestoreKeys';
import { Item } from '@/props/profileProps';
import { Helper } from '@/utility/helper';
import { SelectChangeEvent, useMediaQuery } from '@mui/material';
import {
  DocumentData,
  Query,
  QueryConstraint,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore';
import { useEffect, useRef, useState, memo, MouseEvent } from 'react';
import { SkeletonCardView } from './components/SkeletonCardView';
import { GridChildComponentProps } from 'react-window';
import { useIPAddress } from '@/hooks/useIpAddress';
import { ServiceDetailProps } from '@/props/servicesProps';
import { COLOMBIA, MALAYSIA, PHILIPPINES, SINGAPORE, SOUTH_KOREA } from '@/keys/countries';
import { areaLocalKey } from '@/keys/localStorageKeys';
import { useRouter } from 'next/navigation';
import Box from '@/components/atoms/box';
import LoadingIcon from '@/components/atoms/icons/loading';
import { useAppDispatch } from '@/store/useReduxHook';
import { setSelectedBabe } from '@/store/reducers/babeReducer';
import { setIsOpenProfileModal, useDrawerOpenStore } from '@/store/reducers/drawerOpenReducer';

export interface IRenderComponentProps<Item> {
  /**
   * The index of the cell in the `items` prop array.
   */
  index: number;
  /**
   * The rendered width of the cell's column.
   */
  width: number;
  /**
   * The data at `items[index]` of your `items` prop array.
   */
  data: Item;
}

const locationData = [
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Singapore
      </Typography>
    ),
    key: 'Singapore',
    value: 'Singapore',
  },
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Colombia
      </Typography>
    ),
    key: 'Colombia',
    value: 'Colombia',
  },
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Kuala Lumpur
      </Typography>
    ),
    key: 'Kuala Lumpur',
    value: 'Kuala Lumpur',
  },
];
const recentlySelectionData = [
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Recently Active
      </Typography>
    ),
    key: 'Recently Active',
    value: 'Recently Active',
  },
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Highest Ratings
      </Typography>
    ),
    key: 'Highest Ratings',
    value: 'Highest Ratings',
  },
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Lowest Price
      </Typography>
    ),
    key: 'Lowest Price',
    value: 'Lowest Price',
  },
];
const publicSelectionData = [
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Public
      </Typography>
    ),
    key: 'Public',
    value: '0',
  },
  {
    label: (
      <Typography variant="body2" fontWeight={500} color="#1A1A1A" mr={2}>
        Private
      </Typography>
    ),
    key: 'Private',
    value: '1',
  },
];
const genderSelectionData = [
  {
    label: (
      <Typography variant="subtitle2" color="#1A1A1A" mr={2}>
        Male
      </Typography>
    ),
    key: 'Male',
    value: '1',
  },
  {
    label: (
      <Typography variant="subtitle2" color="#1A1A1A" mr={2}>
        Female
      </Typography>
    ),
    key: 'Female',
    value: '0',
  },
];
const EthnicityData = [
  {
    label: (
      <Typography variant="body2" color="#1A1A1A" fontWeight={500} mr={2}>
        Chinese
      </Typography>
    ),
    key: 'Chinese',
    value: '0',
  },
  {
    label: (
      <Typography variant="body2" color="#1A1A1A" fontWeight={500} mr={2}>
        Malay
      </Typography>
    ),
    key: 'Malay',
    value: '1',
  },
  {
    label: (
      <Typography variant="body2" color="#1A1A1A" fontWeight={500} mr={2}>
        Indian
      </Typography>
    ),
    key: 'Indian',
    value: '2',
  },
];
sessionStorage.setItem('cardData', '[]');
sessionStorage.setItem('cardDataLimit', '');
sessionStorage.setItem('scrollTo', '0');

let initLoading = true;
// const parPage = 50;
const useRentHook = () => {
  const dispatch = useAppDispatch();
  const { isOpenProfileModal } = useDrawerOpenStore();
  const defaultSize = 50;
  const defaultLimitCount = Math.ceil(window.innerHeight / defaultSize);

  const router = useRouter();
  const { favourites } = useGetFavourites();

  const favouritesV2 = [
    {
      image: 'https://images.rentbabe.com/IMAGES/SERVICES/DEFAULT/default.svg',
      title: 'For you',
      category: '',
      // serviceType: "0"
    },
    ...favourites,
  ];

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:1439px)');
  const isTabletMini = useMediaQuery('(max-width:1023px)');
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | undefined>(0);
  const [activeLocation, setActiveLocation] = useState<string>('');
  const [activeRecently, setActiveRecently] = useState<string>('Highest Ratings');
  const [activePublic, setActivePublic] = useState<string>('0');
  const [activeGender, setActiveGender] = useState<string>('');
  const [activeCity, setActiveCity] = useState<string>('');
  const cardData = sessionStorage.getItem('cardData');
  const cardDataLimit = sessionStorage.getItem('cardDataLimit');

  const [items, setItems] = useState<Item[]>(cardData ? JSON.parse(cardData) : []);

  const [hasMore, setHasMore] = useState(false);
  const [startIndex, setIndex] = useState<any>();

  // let parpageCount = parPage;
  // if (cardData) {
  //   parpageCount = (Math.ceil(JSON.parse(cardData)?.length / 50) || 1) * 50;
  // }
  const [limitquery, setLimit] = useState(
    cardDataLimit ? JSON.parse(cardDataLimit) || defaultLimitCount : defaultLimitCount
  );
  const [nickname, setNickname] = useState<string>();
  const [time, setTime] = useState<any>(null);
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardColumnCount, setCardColumnCount] = useState<number>(isMobile ? 2 : isTabletMini ? 3 : isTablet ? 4 : 5);
  const [data, setData] = useState<Item | undefined>();
  const sliderRef = useRef(null);
  const { loadingIPAddress } = useIPAddress();
  const [getRegionState, setRegionState] = useState<string[]>([]);

  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  const categoryObj: ServiceDetailProps | undefined = activeTab
    ? favouritesV2?.find((item, index) => index === activeTab)
    : undefined;
  const activeCategoryId = categoryObj?.category || '';
  const categoryTitle = categoryObj?.title;
  useEffect(() => {
    if (!loadingIPAddress) {
      console.log(getRegionState);
      setArea();
    }
    // eslint-disable-next-line
  }, [loadingIPAddress]);

  useEffect(() => {
    const scrollTo = sessionStorage.getItem('scrollTo');

    if (scrollTo) {
      window.scrollTo(0, parseInt(scrollTo));
    }
  });

  const setArea = () => {
    const query = sessionStorage.getItem(stateKey)?.toLowerCase();
    if (query) {
      const currentPageState = Helper.getCurrentPageState();
      let areaData = undefined;
      if (currentPageState && currentPageState.length > 0) {
        areaData = currentPageState;
        setRegionState(currentPageState);
      } else {
        if (query === 'ph') {
          areaData = PHILIPPINES;
          setRegionState(PHILIPPINES);
        } else if (query === 'my') {
          areaData = MALAYSIA;
          setRegionState(MALAYSIA);
        } else if (query === 'co') {
          areaData = COLOMBIA;
          setRegionState(COLOMBIA);
        } else if (query === 'kr') {
          areaData = SOUTH_KOREA;
          setRegionState(SOUTH_KOREA);
        } else {
          areaData = SINGAPORE;
          setRegionState(SINGAPORE);
        }
      }
      localStorage.setItem(areaLocalKey, areaData.join(', '));
    } else {
      setRegionState(SINGAPORE);
      localStorage.setItem(areaLocalKey, SINGAPORE.join(', '));
    }
  };
  useEffect(() => {
    setCardColumnCount(isMobile ? 2 : isTabletMini ? 3 : isTablet ? 4 : 5);
  }, [isMobile, isTablet, isTabletMini]);

  const backVideoHandler = () => {
    if (currentVideoIndex < 1) {
      return;
    }
    setCurrentVideoIndex((prev) => prev - 1);
  };
  const nextVideoHandler = () => {
    if (currentVideoIndex >= mediaLinks.length - 1) {
      return;
    }
    setCurrentVideoIndex((prev) => prev + 1);
  };

  const handleTabChange = (e: number | undefined) => {
    setItems([]);
    setLoading(true);
    getDocs(
      getQuery(
        db,
        parseInt(activeCity),
        parseInt(activeGender),
        activeLocation,
        limitquery,
        parseInt(activePublic),
        e?.toString(),
        activeRecently
      )
    )
      .then((snapshot) => {
        const docs = snapshot?.docs;
        const List: any = [];
        docs?.forEach((currentDocument) => {
          const newItem = Helper.createItemFromDocument(currentDocument);
          if (newItem) {
            List.push(newItem);
          }
        });

        if (List?.length < defaultLimitCount) {
          setHasMore(false);
        }

        setItems(List);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err ==> ', err);

        setLoading(false);
      });
    setActiveTab(e);
  };
  const handleLocationChange = (event: SelectChangeEvent) => {
    setActiveLocation(event.target.value);
  };

  const handleDirectLocationChange = (event: SelectChangeEvent) => {
    setActiveLocation(event?.target?.value);
    if (isMobile) {
      setLoading(true);
      getDocs(
        getQuery(
          db,
          parseInt(activeCity),
          parseInt(activeGender),
          event.target.value,
          limitquery,
          parseInt(activePublic),
          activeTab?.toString(),
          activeRecently
        )
      )
        .then((snapshot) => {
          const docs = snapshot?.docs;

          const List: any = [];

          docs?.forEach((currentDocument) => {
            const newItem = Helper.createItemFromDocument(currentDocument);
            if (newItem) {
              List.push(newItem);
            }
          });
          if (List?.length < defaultLimitCount) {
            setHasMore(false);
          }
          setItems(List);
          setLoading(false);
        })
        .catch((err) => {
          console.log('Error ==> ', err);

          setLoading(false);
        });
    }
  };

  const handleRecentlyChange = (event: SelectChangeEvent) => {
    setActiveRecently(event?.target?.value);
  };
  const handlePublicChange = (event: SelectChangeEvent) => {
    setActivePublic(event?.target?.value);
  };
  const handleGenderChange = (event: SelectChangeEvent) => {
    setActiveGender(event?.target?.value);
  };
  const handleEthnicityChange = (event: SelectChangeEvent) => {
    setActiveCity(event?.target?.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = (e?.target as HTMLInputElement)?.value?.toLowerCase();

    setData(undefined);
    clearTimeout(time);
    setTime(null);
    setReset(false);
    if (!text) {
      setReset(true);
      return;
    }

    //check server
    setTime(
      setTimeout(async () => {
        let isValid = true;
        const nameRegex = /^[a-z\-]+$/; // eslint-disable-line
        if (text.match(nameRegex) === null || text.length < 3) {
          isValid = false;
          //setErrorMessage("username must contains a-z. NO spacing, NO numbers. Minimum length is 3 characters.")
        } else if (nickname === 'undefined') {
          isValid = false;
          //setErrorMessage("This username is not available. Please try again.")
        } else {
          try {
            const snap = await getDocs(query(collection(db, USERS), where(nicknameKey, '==', text), limit(1)));

            if (snap?.docs?.length !== 0) {
              const doc = snap?.docs[0];
              const item = Helper.createItemFromDocument(doc);
              setData(item);
            }
          } catch (error) {
            console.log('error =>', error);
          }
        }
        if (isValid) {
          setNickname(text);
        } else {
          setData(undefined);
        }
        setTime(null);
      }, 1200)
    );
  };
  const handlePrev = () => {
    if (sliderRef?.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sliderRef?.current.slickPrev();
    }
  };
  const handleNext = () => {
    if (sliderRef?.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      sliderRef?.current.slickNext();
    }
  };

  const handleApply = () => {
    setLoading(true);
    getDocs(
      getQuery(
        db,
        parseInt(activeCity),
        parseInt(activeGender),
        activeLocation,
        limitquery,
        parseInt(activePublic),
        activeTab?.toString(),
        activeRecently
      )
    )
      .then((snapshot) => {
        const docs = snapshot.docs;

        const List: any = [];

        docs.forEach((currentDocument) => {
          const newItem = Helper.createItemFromDocument(currentDocument);
          if (newItem) {
            List.push(newItem);
          }
        });
        if (List?.length < defaultLimitCount) {
          setHasMore(false);
        }

        setItems(List);
        setFilterIsOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error ==> ', err);

        setLoading(false);
      });
  };

  const fetchMoreData = (props: any, totalItems: number) => {
    const totalRowCount = Math.ceil(totalItems / cardColumnCount);
    const rowHeight = isMobile ? 365 : 420;
    const isAtBottom = props?.scrollTop > 0.5 * (totalRowCount * rowHeight - 350);

    if (isAtBottom) {
      if (limitquery === items?.length) {
        const newLimit = limitquery + defaultLimitCount;
        setLimit(newLimit);
      }
    }
    if (window?.scrollY > 2000) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const getQuery = (
    db: any,
    raceIndex: number,
    genderIndex: number,
    state: string | undefined,
    limitNumber: number,
    privacy: number,
    category?: string,
    recently?: string
  ): Query<DocumentData> => {
    const gIndex = genderIndex;
    const count = [];
    const whereAdminTrue = where(adminKey, '==', true);
    count.push('adminKey');
    const limitBy = limit(defaultLimitCount);
    // const startIdx = startAt(startIndex);
    const startIdx = startAfter(startIndex);
    count.push('limitBy');
    const queries: QueryConstraint[] = [whereAdminTrue];
    if (recently) {
      count.push('recently');
      if (recently === 'Recently Active') {
        const whereTimestamp = orderBy(timeStampKey, 'desc');

        queries.push(whereTimestamp);
      } else if (recently === 'Highest Ratings') {
        const whereHighestRatings = orderBy(sortByRatingsKey, 'desc');

        queries.push(whereHighestRatings);
      } else if (recently === 'Lowest Price') {
        const highLow = lowestKey;
        const whereLowestPrice = orderBy(`${sortByPricingKey}.${highLow}`, 'asc');

        queries.push(whereLowestPrice);
      }
    }

    queries.push(limitBy);
    if (startIndex) {
      queries.push(startIdx);
    }
    let isForAllCountry: boolean = true;

    if (category && parseInt(category) != 0) {
      count.push('category');
      const currCatObj = favouritesV2?.find((item, index) => index === parseInt(category));
      if (currCatObj?.serviceType === 1) {
        isForAllCountry = false;
        setActiveLocation('');
      } else if (!state) {
        setActiveLocation('Singapore');
      }
      const whereCategory = where(
        `${servicesKey}.${currCatObj?.serviceType}.${currCatObj?.category}.id`,
        '==',
        `${currCatObj?.category}`
      );
      queries.push(whereCategory);
    }

    if (!isNaN(gIndex)) {
      count.push('gIndex');
      const whereGender = where(genderKey, '==', gIndex);
      queries.push(whereGender);
    }

    if (isForAllCountry) {
      count.push('state');
      const whereRegion = where(geoEncodings, 'array-contains', state || 'Singapore');
      queries.push(whereRegion);
    }

    if (!isNaN(privacy)) {
      count.push('privacy');
      const wherePrivacy = where(privacyKey, '==', privacy);
      queries.push(wherePrivacy);
    }

    if (!isNaN(raceIndex)) {
      count.push('raceIndex');
      const whereRace = where(`${raceKey}2.${raceIndex}`, '==', true);
      queries.push(whereRace);
    }
    const getUserByLatest: Query<DocumentData> = query(collection(db, USERS), ...queries);
    return getUserByLatest;
  };

  useEffect(() => {
    setHasMore(true);
    getDocs(
      getQuery(
        db,
        parseInt(activeCity),
        parseInt(activeGender),
        activeLocation,
        limitquery,
        parseInt(activePublic),
        activeTab?.toString(),
        activeRecently
      )
    )
      .then((snapshot) => {
        const documents = snapshot.docs;
        const itemList: any = [];
        // const startIndex = parPage - 50;
        documents.forEach((currentDocument) => {
          const newItem = Helper.createItemFromDocument(currentDocument);
          if (newItem) {
            itemList.push(newItem);
          }
        });
        // if (itemList?.length > items?.length) {
        //   sessionStorage.setItem('cardData', JSON.stringify(itemList));
        //   sessionStorage.setItem('cardDataLimit', JSON.stringify(limitquery));
        //   setItems(itemList);
        // }
        // if (itemList?.length < limitquery) {
        if (itemList?.length < defaultLimitCount) {
          setHasMore(false);
        } else {
          const newArr = items?.concat(itemList);
          sessionStorage.setItem('cardData', JSON.stringify(newArr));
          sessionStorage.setItem('cardDataLimit', JSON.stringify(limitquery));
          setItems(newArr);
        }
        setIndex(documents?.[documents.length - 1]);
        setLoading(false);
        // setInitLoading(false);
        initLoading = false;
      })
      .catch((error) => {
        console.log('error==> ', error);

        setLoading(false);
      });
  }, [limitquery]);

  const onOpenFilter = () => {
    setFilterIsOpen(true);
  };
  const onCloseFilter = () => {
    setFilterIsOpen(false);
  };

  const onClickBabeCard = (e: MouseEvent, babeInfo: any) => {
    e.preventDefault();
    dispatch(setSelectedBabe(babeInfo));
    if (isMobile) {
      router.push(`/profile/${babeInfo?.uid}`);
    } else {
      dispatch(setIsOpenProfileModal(true));
    }
  };

  // eslint-disable-next-line react/display-name
  const Column = memo(({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const index = rowIndex * cardColumnCount + columnIndex;
    const obj: Item = items[index];

    return (
      <>
        <div
          id={obj?.uid}
          style={{
            gap: '20px',
            paddingLeft: columnIndex === 0 ? (isTabletMini ? '6px' : '10px') : isTabletMini ? '6px' : '10px',
            paddingRight:
              columnIndex === cardColumnCount ? (isTabletMini ? '6px' : '12px') : isTabletMini ? '6px' : '10px',
            paddingBottom: isTabletMini ? '12px' : '20px',
            paddingTop: rowIndex === 0 ? (isTabletMini ? '12px' : '24px') : isTabletMini ? '12px' : '20px',
            ...style,
          }}
        >
          {!obj && loading ? (
            <SkeletonCardView key={index} />
          ) : obj ? (
            <BabeCard
              key={index}
              // id={obj?.uid}
              babeData={obj}
              onClickHandler={onClickBabeCard}
              size={isTabletMini ? 'small' : 'medium'}
              category={activeCategoryId}
              categoryTitle={categoryTitle}
              categoryObj={categoryObj}
              favouritesV2={favouritesV2}
            />
          ) : (
            ''
          )}
          {index === items?.length - 1 && (
            <Box
              sx={{
                padding: '50px',
                maxWidth: '1440px',
                width: '100%',
                textAlign: 'center',
                color: 'black',
                position: 'fixed',
                left: isTabletMini ? '-25px' : '0%',
              }}
            >
              {hasMore ? <LoadingIcon /> : 'No More Profile'}
            </Box>
          )}
        </div>
      </>
    );
  });

  const scrollToTop = () => {
    window?.scrollTo(0, 0);
  };

  return {
    isMobile,
    isTablet,
    isTabletMini,
    loading,
    initLoading,
    cardColumnCount,
    Column,
    filterIsOpen,
    limitquery,
    currentVideoIndex,
    mediaLinks,
    activeTab,
    activeLocation,
    activeRecently,
    activePublic,
    activeGender,
    activeCity,
    time,
    locationData,
    recentlySelectionData,
    publicSelectionData,
    genderSelectionData,
    EthnicityData,
    sliderRef,
    favouritesV2,
    items,
    reset,
    nickname,
    data,
    regionState: activeLocation ? [activeLocation] : getRegionState,
    isOpenProfileModal,
    showScrollToTop,
    scrollToTop,
    onClickBabeCard,
    handleTabChange,
    onOpenFilter,
    onCloseFilter,
    handleSearch,
    handleNext,
    handleApply,
    handlePrev,
    fetchMoreData,
    handleLocationChange,
    handleDirectLocationChange,
    handleRecentlyChange,
    handlePublicChange,
    handleGenderChange,
    handleEthnicityChange,
    backVideoHandler,
    nextVideoHandler,
    setActiveLocation,
  };
};

export default useRentHook;
