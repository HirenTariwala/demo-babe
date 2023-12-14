import { mediaLinks } from '@/common/utils/data';
import Typography from '@/components/atoms/typography';
import BabeCard from '@/components/molecules/card/babe';
import { db } from '@/credentials/firebase';
import { useGetFavourites } from '@/hooks/useGetFavouties';
import {
  USERS,
  adminKey,
  endKey,
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
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useRef, useState, memo } from 'react';
import { SkeletonCardView } from './components/SkeletonCardView';
import { GridChildComponentProps } from 'react-window';
import { useIPAddress } from '@/hooks/useIpAddress';
import { ServiceDetailProps } from '@/props/servicesProps';
import { COLOMBIA, MALAYSIA, PHILIPPINES, SINGAPORE, SOUTH_KOREA } from '@/keys/countries';
import { areaLocalKey } from '@/keys/localStorageKeys';
import { useRouter } from 'next/navigation';

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
    value: '3',
  },
];
// const GOOGLE_MAPS_API_KEY = 'AIzaSyC3aviU6KHXAjoSnxcw6qbOhjnFctbxPkE';

let initLoading = true
const parPage = 50;
const useRentHook = () => {
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | undefined>(0);
  const [activeLocation, setActiveLocation] = useState<string>('');
  const [activeRecently, setActiveRecently] = useState<string>('Highest Ratings');
  const [activePublic, setActivePublic] = useState<string>('0');
  const [activeGender, setActiveGender] = useState<string>('');
  const [activeCity, setActiveCity] = useState<string>('');
  const [items, setItems] = useState([]);

  const [hasMore, setHasMore] = useState(false);
  const [limitquery, setLimit] = useState(parPage);
  const [goNow, setGoNow] = useState<Item[]>([]);
  const [numberOfProfilesTODAY, setNumberOfProfilesTODAY] = useState<number>(NaN);
  const [nickname, setNickname] = useState<string>();
  const [time, setTime] = useState<any>(null);
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUid, setSelectedUid] = useState('');
  const [cardColumnCount, setCardColumnCount] = useState<number>(isMobile ? 2 : 5);

  const [data, setData] = useState<Item | undefined>();
  const sliderRef = useRef(null);
  const midnight = useRef<Date>(new Date(new Date()));
  const today = useRef<Date>(new Date(new Date()));
  const TODAYLimit = Math.ceil(window.innerWidth / (120 + 16)) + 2;
  const { loadingIPAddress } = useIPAddress()
  const [getRegionState, setRegionState] = useState<string[]>([])

  const categoryObj: ServiceDetailProps | undefined = activeTab ? favouritesV2?.find((item, index) => index === activeTab) : undefined;
  const activeCategoryId = categoryObj?.category || '';
  const categoryTitle = categoryObj?.title;

  
  useEffect(() => {
    if( !loadingIPAddress){ 
      console.log(getRegionState, hasMore);
      
      setArea()
    }
    // eslint-disable-next-line 
  }, [loadingIPAddress])

  const setArea = () => {
    const query = sessionStorage.getItem(stateKey)?.toLowerCase()
    if(query){
      const currentPageState = Helper.getCurrentPageState()
      let areaData = undefined
      if(currentPageState && currentPageState.length > 0){
        areaData = currentPageState
        setRegionState(currentPageState)
      }else{
        if(query === "ph"){
          areaData= PHILIPPINES
          setRegionState(PHILIPPINES)
        }
        else if(query === "my"){
          areaData= MALAYSIA
          setRegionState(MALAYSIA)
        }else if (query === "co"){
          areaData= COLOMBIA
          setRegionState(COLOMBIA)
        }
        else if (query === "kr"){
          areaData= SOUTH_KOREA
          setRegionState(SOUTH_KOREA)
        }
        else{
          areaData= SINGAPORE
          setRegionState(SINGAPORE)
        }
      }
      localStorage.setItem(areaLocalKey, areaData.join(", "))
    }else{
      // const getState = Helper.getState(phoneNumber)
      // setRegionState(getState)
      // localStorage.setItem(area, getState.join(", "))
      setRegionState(SINGAPORE)
      localStorage.setItem(areaLocalKey, SINGAPORE.join(", "))
    }
   
    // if(serviceIndex.current?.[ServiceType.meetup] || serviceIndex.current?.[ServiceType.sports] ){
    //   setAllCountries(false) 
    // }else{
    //   setAllCountries(true) 
    // }
  }
  useEffect(() => {
    setCardColumnCount(isMobile ? 2 : 5);
  }, [isMobile]);

  const handleClose = () => {
    setOpen(false);
  };
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
        const docs = snapshot.docs;
        const List: any = [];
        docs.forEach((currentDocument) => {
          const newItem = Helper.createItemFromDocument(currentDocument);
          if (newItem) {
            List.push(newItem);
          }
        });

        setItems(List);
        setLoading(false);
        if (List?.length === 0) setHasMore(false);
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
    setActiveLocation(event.target.value);
    if (isMobile) {
      setLoading(true);
      setHasMore(true);
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
          const docs = snapshot.docs;

          const List: any = [];

          docs.forEach((currentDocument) => {
            const newItem = Helper.createItemFromDocument(currentDocument);
            if (newItem) {
              List.push(newItem);
            }
          });
          setItems(List);
          setLoading(false);
          if (List?.length === 0) setHasMore(false);
        })
        .catch((err) => {
          console.log('Error ==> ', err);

          setLoading(false);
        });
    }
  };

  const handleRecentlyChange = (event: SelectChangeEvent) => {
    setActiveRecently(event.target.value);
  };
  const handlePublicChange = (event: SelectChangeEvent) => {
    setActivePublic(event.target.value);
  };
  const handleGenderChange = (event: SelectChangeEvent) => {
    setActiveGender(event.target.value);
  };
  const handleEthnicityChange = (event: SelectChangeEvent) => {
    setActiveCity(event.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = (e.target as HTMLInputElement).value.toLowerCase();

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

            if (snap.docs.length !== 0) {
              const doc = snap.docs[0];
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
    if (sliderRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sliderRef.current.slickPrev();
    }
  };
  const handleNext = () => {
    if (sliderRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      sliderRef.current.slickNext();
    }
  };

  const handleApply = () => {
    setLoading(true);
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
        const docs = snapshot.docs;

        const List: any = [];

        docs.forEach((currentDocument) => {
          const newItem = Helper.createItemFromDocument(currentDocument);
          if (newItem) {
            List.push(newItem);
          }
        });

        setItems(List);
        setFilterIsOpen(false);
        setLoading(false);
        if (List?.length === 0) setHasMore(false);
      })
      .catch((err) => {
        console.log('Error ==> ', err);

        setLoading(false);
      });
  };

  const fetchMoreData = (props: any, totalItems: number) => {
    const totalRowCount = Math.ceil(totalItems / cardColumnCount);
    const rowHeight = isMobile ? 365 : 420;
    const isAtBottom = props?.scrollTop > 0.8 * (totalRowCount * rowHeight - 350);

    if (isAtBottom) {
      // setLimit((prev) => prev + parPage);
      setLimit(limitquery + parPage);
    }
  };

  const goNowObj: Item[] = goNow;

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
    const count = []
    const whereAdminTrue = where(adminKey, '==', true);
    count.push("adminKey");
    const limitBy = limit(limitNumber);
    count.push("limitBy");
    const queries: QueryConstraint[] = [whereAdminTrue];
    if (recently) {
      count.push("recently");
      if (recently === 'Recently Active') {
        // const d = new Date();
        // const whereTimestamp = [
        //   where(applyTimeStampKey, '<', Timestamp.fromDate(new Date(d.setDate(d.getDate() + 10)))),
        //   orderBy(applyTimeStampKey, 'desc'),
        // ];
        const whereTimestamp = orderBy(timeStampKey, 'desc');
        
      
        queries.push(whereTimestamp);
      } else if (recently === 'Highest Ratings') {
        const whereHighestRatings = orderBy(sortByRatingsKey, 'desc');

        queries.push(whereHighestRatings);
      } else if (recently === 'Lowest Price') {
        // const whereLowestPrice = orderBy(sortByPricingKey, 'asc');

        // queries.push(whereLowestPrice);
        const highLow = lowestKey;

        // if(serviceIndex.current){

        //   const keys = Object.keys(serviceIndex.current)
        //   const values = Object.values(serviceIndex.current)

        //   if(keys.length > 0 && values.length > 0){
        //     const key = keys[0]
        //     const value = values[0]

        //     if(value === "-1"){
        //       return `${sortByPricing}.${highLow}`
        //     } else if(value === "-2"){
        //       return `${sortByPricing}.${ServiceType.games}.${highLow}`
        //     } else return `${services}.${key}.${value}.${sortByPricing}`

        //   }else return `${sortByPricing}.${highLow}`

        // }else
        // `${sortByPricingKey}.${highLow}`
        const whereLowestPrice = orderBy(`${sortByPricingKey}.${highLow}`, 'asc');

        queries.push(whereLowestPrice);
      }
    }

    queries.push(limitBy);
    let isForAllCountry: boolean = true
    
    if (category && parseInt(category) != 0) {
      count.push("category");
      const currCatObj = favouritesV2?.find((item, index) => index === parseInt(category));
      if(currCatObj?.serviceType === 1) {
        isForAllCountry= false
        setActiveLocation("")
      } else if(!state) {
        setActiveLocation("Singapore")
      }
      const whereCategory = where(
        `${servicesKey}.${currCatObj?.serviceType}.${currCatObj?.category}.id`,
        '==',
        `${currCatObj?.category}`
      );
      queries.push(whereCategory);
    }

    if (!isNaN(gIndex)) {
      count.push("gIndex");
      const whereGender = where(genderKey, '==', gIndex);
      queries.push(whereGender);
    }

    if (isForAllCountry) {
      count.push("state");
      const whereRegion = where(geoEncodings, 'array-contains', state || "Singapore");
      queries.push(whereRegion);
    }
    // const whereRegion = where(geoEncodings, "array-contains", state)

    // if(_s){
    //   const cat = Object.keys(_s)[0]
    //   if(parseInt(cat) === ServiceTypeEnum.meetup || parseInt(cat) === ServiceTypeEnum.sports){
    //     queries.push(whereRegion)
    //   }
    // }
    // else if(isNaN(deIndex)){
    //   queries.push(whereRegion)
    // }


    
    if (!isNaN(privacy)) {
      count.push("privacy");
      const wherePrivacy = where(privacyKey, '==', privacy);
      queries.push(wherePrivacy);
    }

    if (!isNaN(raceIndex)) {
      count.push("raceIndex")
      const whereRace = where(`${raceKey}2.${raceIndex}`, '==', true);
      queries.push(whereRace);
    }
    
    // console.log(count);
    

    const getUserByLatest: Query<DocumentData> = query(collection(db, USERS), ...queries);
    return getUserByLatest;
  };

  const todayRef = query(
    collection(db, USERS),
    where(geoEncodings, 'array-contains', activeLocation),
    where(adminKey, '==', true),
    where(endKey, '>', Timestamp.fromDate(today.current)),
    where(endKey, '<', Timestamp.fromDate(midnight.current)),
    limit(TODAYLimit),
    orderBy(endKey, 'asc')
  );

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
        
        setItems(itemList);
        setLoading(false);
        // setInitLoading(false);
        initLoading = false
        if (itemList?.length === 0) setHasMore(false);
      })
      .catch((error) => {
        console.log('error==> ', error);

        setLoading(false);
      });

    getDocs(todayRef)
      .then((snap) => {
        for (const doc of snap.docs) {
          const item = Helper.createItemFromDocument(doc);
          goNowObj.push(item as Item);
        }

        const lastDoc = snap.docs.slice(-1)[0];
        if (lastDoc) {
          today.current = (lastDoc.get(endKey) as Timestamp).toDate();
        }
        const numberOfProfiles = snap.docs.length;
        if (numberOfProfiles !== 0) {
          setGoNow([...goNowObj]);
          if (TODAYLimit > numberOfProfiles) {
            setNumberOfProfilesTODAY(goNowObj?.length);
          }
        } else setNumberOfProfilesTODAY(goNowObj?.length);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [limitquery]);

  const onOpenFilter = () => {
    setFilterIsOpen(true);
  };
  const onCloseFilter = () => {
    setFilterIsOpen(false);
  };

  // eslint-disable-next-line react/display-name
  const Column = memo(({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const index = rowIndex * cardColumnCount + columnIndex;
    const obj: Item = items[index];

    return (
      <div
        id={obj?.uid}
        style={{
          gap: '20px',
          paddingLeft: columnIndex === 0 ? (isMobile ? '6px' : '10px') : isMobile ? '6px' : '10px',
          paddingRight: columnIndex === cardColumnCount ? (isMobile ? '6px' : '12px') : isMobile ? '6px' : '10px',
          paddingBottom: isMobile ? '12px' : '20px',
          paddingTop: rowIndex === 0 ? (isMobile ? '12px' : '24px') : isMobile ? '12px' : '20px',
          ...style,
        }}
      >
        {loading ? (
          <SkeletonCardView key={index} />
        ) : obj ? (
          <BabeCard
            key={index}
            id={obj?.uid}
            babeData={obj}
            onClick={(e) => {
              e?.preventDefault()
              // setSelectedUid((items[0] as any)?.uid);
              if(isMobile) {
                router.push(`/profile/${obj?.uid}`)
              } else {
                setSelectedUid(obj?.uid);
                setOpen(true);
              }
            }}
            size={isMobile ? 'small' : 'medium'}
            category={activeCategoryId}
            categoryTitle={categoryTitle}
            categoryObj={categoryObj}
            favouritesV2={favouritesV2}
          />
        ) : (
          ''
        )}
      </div>
    );
  });

  const availableProfileLabel = numberOfProfilesTODAY
    ? numberOfProfilesTODAY == 1
      ? `${numberOfProfilesTODAY} profile is available TODAY 🔥`
      : `${numberOfProfilesTODAY} profiles are available TODAY 🔥`
    : 'Available TODAY 🔥';

  return {
    isMobile,
    loading,
    initLoading,
    cardColumnCount,
    Column,
    filterIsOpen,
    currentVideoIndex,
    mediaLinks,
    activeTab,
    activeLocation,
    activeRecently,
    activePublic,
    activeGender,
    activeCity,
    goNow,
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
    // hasMore,
    data,
    numberOfProfilesTODAY,
    availableProfileLabel,
    open,
    selectedUid,
    handleClose,
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
  };
};

export default useRentHook;
