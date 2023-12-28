import React, { useEffect, useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import BackIcon from '@/components/atoms/icons/backIcon';
import LocationIcon from '@/components/atoms/icons/locationIcon';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import TransactionAmount from '@/components/molecules/content/transaction';
import Dialog from '@/components/molecules/dialogs';
import Dropdown from '@/components/molecules/dropdown';
import Price from '@/components/molecules/price';
import Stepper from '@/components/molecules/stepper';
import { ServiceHelper } from '@/utility/serviceHelper';
import { SelectChangeEvent } from '@mui/material';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Item } from '@/props/profileProps';
import { useSelectedServicesStore } from '@/store/reducers/serviceReducer';
import NextImage from '@/components/atoms/image';
import { MessageEnum, meetupEnum } from '@/enum/myEnum';
import DotIcon from '@/components/atoms/icons/dotIcon';
import { getMessengerIcon } from '@/utility/global';
import { httpsCallable } from 'firebase/functions';
import { newConversationV2Function } from '@/keys/functionNames';
import { functions } from '@/credentials/firebase';
import { useUserStore } from '@/store/reducers/usersReducer';
import {
  APNSTokenKey,
  clubKey,
  infoKey,
  lastMessageKey,
  mobileUrlKey,
  nicknameKey,
  recipientNicknameKey,
  recipientProfileURLKey,
  senderKey,
  senderNicknameKey,
  senderProfileURLKey,
  teleIdKey,
  usersKey,
} from '@/keys/firestoreKeys';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useConversationStore } from '@/store/reducers/conversationReducer';

interface IRequestOrderModal {
  uid?: string;
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  babeInfo: Item | undefined;
  onClick: (arg: boolean) => void;
  setOpen: (arg: boolean) => void;
}

const CabFareComp = (icon: any, text: string) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Typography fontWeight={500}>{text}</Typography>
    </Box>
  );
};

const getCabFarePrice = (cabfare: any) => {
  switch (cabfare) {
    case 0:
      return 0;
    case 10:
      return 1000;
    case 20:
      return 2000;
    case 30:
      return 3000;
    case 40:
      return 4000;
    case 50:
      return 5000;
    case 60:
      return 6000;
    default:
      return 0;
  }
};

const serviceCheck = (imageUrl: string | undefined) => {
  const parts = imageUrl?.split('/SERVICES/');
  if (parts && parts?.length > 1) {
    const extractedString = parts?.[1].split('/')[0];
    return ['EMEET', 'GAMES'].includes(extractedString);
  }
};

const getRestrictions = (meetupType: meetupEnum | undefined): string[] => {
  switch (meetupType) {
    case meetupEnum.meals:
      return ['cafe', 'restaurant', 'bakery', 'bar', 'shopping_mall'];

    case meetupEnum.dining:
      return ['cafe', 'restaurant', 'shopping_mall'];

    case meetupEnum.drinks:
      return ['night_club', 'bar', 'cafe', 'shopping_mall'];

    case meetupEnum.gathering:
      return ['night_club', 'bar', 'cafe', 'restaurant', 'shopping_mall'];

    case meetupEnum.hiking:
      return ['establishment'];

    case meetupEnum.photoshoot:
      return ['establishment'];

    case meetupEnum.movies:
      return ['movie_theater'];
    default:
      return ['cafe', 'restaurant', 'bakery', 'bar', 'shopping_mall'];
  }
};

const placesLibrary = ['places'];

const RequestOrderModal = ({ isMobile, isTablet, isOpen, babeInfo, setOpen, onClick }: IRequestOrderModal) => {
  const [searchResult, setSearchResult] = useState('');
  const [value, setValue] = useState('0');
  const [selectedLocation, setSelectedLocation] = useState('');
  const selectedServiceData = useSelectedServicesStore();
  const [count, setCount] = useState<number>();
  const [date, setDate] = useState<string | null | undefined>();
  const [time, setTime] = useState<string | null | undefined>();
  const [info, setInfo] = useState<string | null | undefined>();
  const [loading, setLoading] = useState<boolean>(false)

  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;

  const currentConversation = useConversationStore();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const finalPrice = count * selectedServiceData?.price + getCabFarePrice(value);

  const cabFareNew = () => {
    const arr: any = [];
    for (let i = 0; i <= 60; i += 10) {
      arr.push({
        label: CabFareComp(<PriceLogo />, `${i} Credits`),
        value: i,
      });
    }
    return arr;
  };

 const getExistingConvo = (currentConversation: any, uid: string) : QueryDocumentSnapshot<DocumentData> | undefined => {
    for (let i = 0; i < (currentConversation?.data?.docs?.length ?? 0) ; ++i) {
      const doc = currentConversation?.data?.docs?.[i];
      if(doc?.get(usersKey).includes(uid)){
        return doc
      }
    }
    return undefined
  }

  const senderSendNewConversation = (
    myUid: string,
    recipientUid: string,
    myNickname: string,
    myProfileImage: string,
    recipientNickname: string,
    recipientProfileURL: string,
    lastMsg: string
  ) => {
    // firestore map key is NOT equals to ConversationInfo
    const map: { [key: string]: any } = {
      [senderKey]: myUid,
      [usersKey]: [recipientUid, myUid],
      [lastMessageKey]: lastMsg,
      [infoKey]: {
        [myUid]: {
          [nicknameKey]: myNickname.toLowerCase(),
          [mobileUrlKey]: myProfileImage,
          [infoKey]: true,
        },
        [recipientUid]: {
          [nicknameKey]: recipientNickname.toLowerCase(),
          [mobileUrlKey]: recipientProfileURL,
          [infoKey]: true,
        },
      },
      [senderProfileURLKey]: myProfileImage,
      [recipientNicknameKey]: recipientNickname.toLowerCase(),
      [senderNicknameKey]: myNickname.toLowerCase(),
      [recipientProfileURLKey]: recipientProfileURL,
    };
    return map;
  };

  useEffect(() => {
    setCount(serviceCheck(selectedServiceData?.image) ? 1 : 2);
  }, [selectedServiceData]);

  const onPlaceChanged = () => {
    if (searchResult != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const place = searchResult.getPlace();
      const name = place.name;
      setSelectedLocation(name);
    } else {
      alert('Please enter text');
    }
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY,
    libraries: placesLibrary,
  } as any);

  const onLoad = (autocomplete: any) => {
    setSearchResult(autocomplete);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setDate(newValue?.toString());
  };

  const handleTimeChange = (newValue: Dayjs | null) => {
    setTime(newValue?.toString());
  };

  const calculateHoursFromPastDateToToday = (pastDate: Date): number => {
    // Get today's date and time
    const today: Date = new Date();
    // Calculate the time difference in milliseconds
    const timeDifference: number = pastDate.getTime() - today.getTime();
    // Calculate the number of hours
    const hoursDifference: number = timeDifference / (1000 * 3600);
    return hoursDifference;
  };

  const setTimeFromDate = (targetDate: Date, sourceDate: Date): Date => {
    const hours = sourceDate.getHours();
    const minutes = sourceDate.getMinutes();
    const seconds = sourceDate.getSeconds();
    const milliseconds = sourceDate.getMilliseconds();
    targetDate.setHours(hours, minutes, seconds, milliseconds);
    return targetDate;
  };

  const onRequestHandler = async() => {
    const serviceMap: { [key: string]: any } = {
      price: finalPrice * 100,
      clientUID: currentUser?.uid,
      babeUID: babeInfo?.uid,
      origin: window.location.origin,
      //@ts-expect-error
      chatRoomID: getExistingConvo(currentConversation,babeInfo.uid)?.id,
      babeNickname: babeInfo?.nickname,
      babeProfileImage: babeInfo?.mobileUrl ?? babeInfo?.urls[0],
      clientNickname: currentUser?.nickname,
      clientProfileImage: currentUser?.profileImage,
      serviceDetails: selectedServiceData,
    };
    if (currentUser?.teleId) serviceMap.clientTeleID = currentUser?.teleId;
    if (currentUser?.APNSToken) serviceMap.clientToken = currentUser?.APNSToken;
    const newConversation = httpsCallable(functions, newConversationV2Function);
    //@ts-expect-error
    const extra = senderSendNewConversation( currentUser?.uid,
      babeInfo?.uid,
      currentUser?.nickname,
      currentUser?.profileImage,
      babeInfo?.nickname,
      babeInfo?.mobileUrl ,
      ""
    );
    const map: { [key: string]: any } = {
      //@ts-expect-error
      recipientUid: babeInfo.uid,
      content: "",
      extra: extra,
    };
    const msgMap: { [key: string]: any } = {
      sen: currentUser?.uid,
      ctn: "",
      ty: MessageEnum.order,
    };
    if (serviceMap.clientNickname) {
      msgMap.nick = serviceMap.clientNickname;
    }
    if (babeInfo?.clubName && babeInfo?.clubState && babeInfo?.clubName !== 'rentbabe') {
      msgMap[clubKey] = {
        name: babeInfo?.clubName,
        state: babeInfo?.clubState,
      };
    }
    if (serviceMap.clientProfileImage) {
      msgMap[mobileUrlKey] = serviceMap.clientProfileImage;
    }
    if (babeInfo?.teleId) msgMap[teleIdKey] = babeInfo?.teleId;
    if (babeInfo?.APNSToken) msgMap[APNSTokenKey] = babeInfo?.APNSToken;
    if (serviceMap) {
      msgMap.order = serviceMap;
    }
    map.msg = msgMap;
    try {
      setLoading(true)
      const res = await newConversation(map);
      const data = res.data as any;
      const result = data.result as string | null | undefined;
      const chatRoomId = data.chatRoomId as string | null | undefined;
      setLoading(false)
      console.log("call", data)
      // onSuccess(chatRoomId, result);
    } catch (error) {
      setLoading(false)
      console.log(error);
      // onSuccess(null, `Unexpected error ${error}`);
    }
  };
//@ts-expect-error
  const emeetsArr = babeInfo?.emeets?.pref?.concat(babeInfo?.emeets?.app);

  const datejs = dayjs(date);
  const timejs = dayjs(time);
  const today = dayjs()
    .set('date', datejs.date())
    .set('month', datejs.month())
    .set('year', datejs.year())
    .set('hour', timejs.hour())
    .set('minute', timejs.minute())
    .set('second', timejs.second());

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  console.log('dattaa', babeInfo);

  return (
    <Dialog
      maxWidth="sm"
      onClose={() => onClick(false)}
      footer={
        <Box display="flex" justifyContent="flex-end" flexDirection="column" gap={5} p={4}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography variant="subtitle2" component="span" color="#999">
              Total price
            </Typography>
            <TransactionAmount amount={selectedServiceData && finalPrice} sx={{ flexDirection: 'row-reverse' }} />
          </Box>
          <Box display="flex" gap={3}>
            <Button
              variant="outlined"
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={() => onClick(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!info}
              loading={loading}
              sx={{
                p: '12px 20px',
                whiteSpace: 'nowrap',
                height: 48,
              }}
              onClick={onRequestHandler}
            >
              Send request
            </Button>
          </Box>
        </Box>
      }
      sx={{
        '.MuiPaper-root': {
          borderRadius: '24px',
          width: isMobile ? '100%' : isTablet ? '800px' : '1000px',
        },
        '.MuiDialogContent-root': {
          position: 'relative',
        },
      }}
      open={isOpen}
    >
      <Button
        startIcon={<BackIcon />}
        sx={{ width: 'fit-content', fontSize: '14px', fontWeight: 700, padding: '6px 0px' }}
        onClick={() => {
          setOpen(true);
          onClick(false);
        }}
      >
        Back
      </Button>

      <Box display="flex" flexDirection="column" gap={5}>
        <Typography variant="h3" fontWeight={500}>
          Request order
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          {serviceCheck(selectedServiceData?.image) &&
            emeetsArr?.map((item, index) => {
              let name = item;
              if (name === 'text') {
                name = 'Texting';
              } else if (name === 'audio') {
                name = 'Audio';
              } else if (name === 'video') {
                name = 'Video calls';
              }
              return (
                <Box display="flex" alignItems="center" key={index} gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <NextImage
                      width={16}
                      height={16}
                      src={
                        item === 'text' || item === 'audio' || item === 'video'
                          ? 'https://images.rentbabe.com/assets/mui/green_tick.svg'
                          : getMessengerIcon(item)
                      }
                      alt=""
                    />
                    <Typography variant="body2" component="span" sx={{ textTransform: 'capitilize' }}>
                      {name}
                    </Typography>
                  </Box>
                  {emeetsArr?.length !== index + 1 && <DotIcon />}
                </Box>
              );
            })}
        </Box>
        <Box display="flex" gap={3}>
          <NextImage
            src={selectedServiceData?.image}
            alt={'image'}
            width={80}
            height={80}
            style={{ borderRadius: 12 }}
          />
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            gap={3}
            width="-webkit-fill-available"
          >
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h5" component="span">
                {selectedServiceData?.title}
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Avatar avatars={[{ alt: 'H', src: babeInfo?.mobileUrl }]} sx={{ width: 24, height: 24 }} />
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="subtitle2" fontWeight={500} color="#646464">
                    {babeInfo?.nickname}
                  </Typography>
                </Box>
              </Box>
              <Price
                priceData={{
                  price: selectedServiceData?.price || 0,
                  min: selectedServiceData?.price || 0,
                  max: selectedServiceData?.price || 0,
                  hr: ServiceHelper.convertUnits(selectedServiceData?.suffix),
                }}
                category="1"
              />
            </Box>
            <Stepper
              text={!serviceCheck(selectedServiceData?.image) ? `Minimum ${2} units` : undefined}
              setCount={setCount}
              count={count || 1}
            />
          </Box>
        </Box>
        {!info && (
          <Typography variant="subtitle2" fontWeight={500} color="error">
            Please fill in the given fields
          </Typography>
        )}
        {!serviceCheck(selectedServiceData?.image) && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle2" component="span">
              Search a Cafe/bistro/bar
            </Typography>
            <Autocomplete
              onPlaceChanged={onPlaceChanged}
              onLoad={onLoad}
              //@ts-expect-error
              options={{ types: getRestrictions(selectedServiceData?.id), fields: ['name'] }}
            >
              <Input
                fullWidth
                size="small"
                placeholder="Text"
                inputProps={{ sx: { padding: '12px 24px 12px 12px' } }}
                InputProps={{
                  startAdornment: (
                    // <FireIcon/>
                    <LocationIcon color="black" size={24} />
                  ),
                }}
              />
            </Autocomplete>
          </Box>
        )}
        <Box display="flex" gap={3} justifyContent="space-between">
          <Box display="flex" width={'50%'} flex={'1 0 0'} flexDirection="column" gap={2}>
            <Typography variant="subtitle2" component="span">
              Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                value={dayjs(date)}
                onChange={handleDateChange}
                format="MMM DD"
                sx={{
                  '.MuiOutlinedInput-input': {
                    padding: '12px 24px',
                  },
                }}
                slotProps={{
                  textField: {
                    placeholder: 'DD/MM',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box display="flex" width={'50%'} flex={'1 0 0'} flexDirection="column" gap={2}>
            <Typography variant="subtitle2" component="span">
              Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                ampm
                sx={{
                  '.MuiOutlinedInput-input': {
                    padding: '12px 24px',
                  },
                }}
                ampmInClock
                value={dayjs(time)}
                onChange={handleTimeChange}
                slotProps={{
                  textField: {
                    placeholder: 'HH:MM',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        {calculateHoursFromPastDateToToday(setTimeFromDate(dayjs(date).toDate(), dayjs(time).toDate())) > 72 && (
          <Typography variant="caption" color="error">
            Immediate refunds in credits are available within 72 hours of purchase. After 72 hours, credits may be
            converted to cash. Please book 1-2 days ahead.
          </Typography>
        )}
        {today < dayjs() && (
          <Typography variant="caption" color="error">
            Wrong date/time. Now is already {dayjs().format('h:mm a. ddd DD MMM')}
          </Typography>
        )}
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="subtitle2" component="span">
            Additional information
          </Typography>
          <Input
            fullWidth
            size="small"
            placeholder="Additional information"
            inputProps={{ sx: { padding: '12px 24px' } }}
            onChange={(e) => {
              const v = e.currentTarget.value as string;
              setInfo(v);
            }}
          />
        </Box>
        {!serviceCheck(selectedServiceData?.image) && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle2" component="span">
              Cab fare
            </Typography>
            <Dropdown
              listData={cabFareNew()}
              value={value}
              size="small"
              onChange={handleChange}
              sx={{ '.MuiOutlinedInput-input': { padding: '12px 24px' } }}
            ></Dropdown>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default RequestOrderModal;
