import React, { useEffect, useState } from 'react';
import Avatar from '@/components/atoms/avatar';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import BackIcon from '@/components/atoms/icons/backIcon';
import LocationIcon from '@/components/atoms/icons/locationIcon';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import TransactionAmount from '@/components/molecules/content/transaction';
import Dialog from '@/components/molecules/dialogs';
import Dropdown from '@/components/molecules/dropdown';
import Price from '@/components/molecules/price';
import Stepper from '@/components/molecules/stepper';
import { ServiceHelper } from '@/utility/serviceHelper';
import { SelectChangeEvent, useMediaQuery } from '@mui/material';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { setRequestModalOpen, useSelectedServicesStore, useServicesStore } from '@/store/reducers/serviceReducer';
import NextImage from '@/components/atoms/image';
import { MessageEnum, UnitsEnum } from '@/enum/myEnum';
import DotIcon from '@/components/atoms/icons/dotIcon';
import { getMessengerIcon } from '@/utility/global';
import { httpsCallable } from 'firebase/functions';
import { newConversationV2Function } from '@/keys/functionNames';
import { functions } from '@/credentials/firebase';
import { useUserStore } from '@/store/reducers/usersReducer';
import { APNSTokenKey, clubKey, mobileUrlKey, teleIdKey } from '@/keys/firestoreKeys';
import { useConversationStore } from '@/store/reducers/conversationReducer';
import { useSeletedBabeStore } from '@/store/reducers/babeReducer';
import GreenTickIcon from '@/components/atoms/icons/greenTickIcon';
import { useDispatch } from 'react-redux';
import {
  cabFareNew,
  getCabFarePrice,
  getExistingConvo,
  getRestrictions,
  // isExistsValue,
  senderSendNewConversation,
  serviceCheck,
} from '../util/helper';
import Toast from '@/components/molecules/toast';
import { ServiceTypeEnum } from '@/props/servicesProps';
// import { messenger, nsfw, payment, sendTelegramNotificationToAdmin, sex } from '@/keys/filters';
import { CountryLookUpTable } from '@/common/utils/data';
import { setIsOpenProfileModal } from '@/store/reducers/drawerOpenReducer';

interface IRequestOrderModal {
  state?: any;
  uid?: string;
  isOpen: boolean;
}

const placesLibrary = ['places'];

// const sexWithNsfwArray = sex?.concat(nsfw);
// const paymentWithMessengerArray = payment?.concat(messenger);

const RequestOrderModal = ({ state, isOpen }: IRequestOrderModal) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const { selectedBabe } = useSeletedBabeStore();
  const [searchResult, setSearchResult] = useState('');
  const [value, setValue] = useState('0');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [count, setCount] = useState<number | any>();
  const [date, setDate] = useState<string | null | undefined>();
  const [time, setTime] = useState<string | null | undefined>();
  const [info, setInfo] = useState<string | null | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openToast, setToast] = useState<boolean>(false);
  const dispatch = useDispatch();
  const selectedServiceData = useSelectedServicesStore();
  const { services } = useServicesStore();

  const temp = services.find((service) => service.title === selectedServiceData.title);

  const serviceObj = {
    details: selectedServiceData,
    id: temp?.id,
    serviceType: temp?.serviceType,
  };

  const toValue =
    selectedServiceData?.suffix === UnitsEnum.min
      ? ` - ${dayjs(time)
          .add(15 * count, 'm')
          .format('h:mm A')}`
      : selectedServiceData?.suffix === UnitsEnum.hr
      ? ` - ${dayjs(time)
          .add(60 * count, 'm')
          .format('h:mm A')}`
      : selectedServiceData?.suffix === UnitsEnum.game
      ? ` for ${count} Game${count > 1 ? 's' : ''}`
      : '';

  const areAllFieldsFilled = temp?.serviceType === ServiceTypeEnum.meetup ? !(info && selectedLocation) : !info;

  const userStore = useUserStore();
  const currentUser = userStore?.currentUser;

  const currentConversation = useConversationStore();

  const finalPrice = count * (selectedServiceData?.price || 0) + getCabFarePrice(value);

  useEffect(() => {
    setCount(serviceCheck(selectedServiceData?.serviceType) ? 1 : 2);
  }, [selectedServiceData]);

  const onPlaceChanged = () => {
    if (searchResult != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const place = searchResult?.getPlace();
      const name = place?.name;

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

  const onRequestHandler = async () => {
    if (!currentUser?.uid) return;

    if (
      !(temp?.serviceType === ServiceTypeEnum?.eMeet || temp?.serviceType === ServiceTypeEnum?.games) &&
      !selectedLocation
    )
      return;

    // if (isExistsValue(sexWithNsfwArray, info)) return;

    // if (isExistsValue(paymentWithMessengerArray, info)) return;

    // const selected = isExistsValue(sex, info);

    // if (selected) {
    //   const chatLink = `${window?.location?.origin}/Profile?uid=${currentUser?.uid}`;
    //   sendTelegramNotificationToAdmin(`${chatLink} doing obvious NSFW request! [${selected}\n\n${info}]`);
    //   return;
    // }

    const header = 'ORDER REQUEST\n';
    const orderDate = `Date: ${dayjs(date).format('ddd, DD MMM')}\n`;
    const orderTime = `Time: ${dayjs(time).format('h:mm A')}${toValue}\n`;
    const venue = `Venue: ${selectedLocation}\n`;
    const activity = `Activity: ${selectedServiceData?.title}\n`;
    const cabFare = `Cab fare: ${value ? `+${value} Credits` : '-'}\n`;
    const orderInfo = `Info: ${info ? info : '-'}\n`;
    const orderFinalPrice = `\n\nFINAL PRICE: ${(finalPrice / 100).toFixed(2)} Credit`;

    const msg = `${header}${orderDate}${orderTime}${venue}${activity}${cabFare}${orderInfo}${orderFinalPrice}`;
    const eMsg = `${header}${orderDate}${orderTime}${activity}${orderInfo}${orderFinalPrice}`;
    const fMsg = temp?.serviceType === ServiceTypeEnum?.meetup ? msg : eMsg;

    const serviceMap: { [key: string]: any } = {
      price: finalPrice,
      clientUID: currentUser?.uid,
      babeUID: selectedBabe?.uid,
      origin: window.location.origin,
      chatRoomID: getExistingConvo(currentConversation, selectedBabe?.uid)?.id,
      babeNickname: selectedBabe?.nickname,
      babeProfileImage: selectedBabe?.mobileUrl ?? selectedBabe?.urls[0],
      clientNickname: currentUser?.nickname,
      clientProfileImage: currentUser?.profileImage,
      serviceDetails: serviceObj,
    };
    if (currentUser?.teleId) serviceMap.clientTeleID = currentUser?.teleId;

    if (currentUser?.APNSToken) serviceMap.clientToken = currentUser?.APNSToken;

    const newConversation = httpsCallable(functions, newConversationV2Function);

    const extra = senderSendNewConversation(
      currentUser?.uid || '',
      selectedBabe?.uid || '',
      currentUser?.nickname || '',
      currentUser?.profileImage || '',
      selectedBabe?.nickname || '',
      selectedBabe?.mobileUrl || '',
      fMsg
    );

    const map: { [key: string]: any } = {
      recipientUid: selectedBabe?.uid,
      content: fMsg,
      extra: extra,
    };

    const msgMap: { [key: string]: any } = {
      sen: currentUser?.uid,
      ctn: fMsg,
      ty: MessageEnum.order,
    };

    if (serviceMap?.clientNickname) msgMap.nick = serviceMap?.clientNickname;

    if (selectedBabe?.clubName && selectedBabe?.clubState && selectedBabe?.clubName !== 'rentbabe')
      msgMap[clubKey] = {
        name: selectedBabe?.clubName,
        state: selectedBabe?.clubState,
      };

    if (serviceMap?.clientProfileImage) msgMap[mobileUrlKey] = serviceMap?.clientProfileImage;

    if (selectedBabe?.teleId) msgMap[teleIdKey] = selectedBabe?.teleId;

    if (selectedBabe?.APNSToken) msgMap[APNSTokenKey] = selectedBabe?.APNSToken;

    if (serviceMap) msgMap.order = serviceMap;

    map.msg = msgMap;

    try {
      setLoading(true);
      const res = await newConversation(map);
      const data = res?.data as any;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = data?.result as string | null | undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chatRoomId = data?.chatRoomId as string | null | undefined;

      setLoading(false);
      setToast(true);
      dispatch(setRequestModalOpen(false));
    } catch (error) {
      setLoading(false);
      console.log('Request Order Modal Error ==> ', error);
    }
  };

  const emeetsArr = selectedBabe?.emeets?.pref?.concat(selectedBabe?.emeets?.app || []);

  const timejs = dayjs(time);
  const today = dayjs(date).set('hour', timejs.hour()).set('minute', timejs.minute()).set('second', timejs.second());

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={() => dispatch(setRequestModalOpen(false))}
        footer={
          <Box display="flex" justifyContent={'flex-end'} flexDirection="column" gap={5} p={4}>
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
                onClick={() => dispatch(setRequestModalOpen(false))}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={areAllFieldsFilled}
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
          '.MuiDialogActions-root': {
            justifyContent: isMobile ? 'center' : 'flex-end',
          },
        }}
        open={isOpen}
      >
        <Button
          startIcon={<BackIcon />}
          sx={{ width: 'fit-content', fontSize: '14px', fontWeight: 700, padding: '6px 0px' }}
          onClick={() => {
            dispatch(setIsOpenProfileModal(true));
            dispatch(setRequestModalOpen(false));
          }}
        >
          Back
        </Button>

        <Box display="flex" flexDirection="column" gap={5}>
          <Typography variant="h3" fontWeight={500}>
            Request order
          </Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            {selectedServiceData?.serviceType === ServiceTypeEnum.eMeet &&
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
                      {['text', 'audio', 'video']?.includes(item) ? (
                        <GreenTickIcon />
                      ) : (
                        <NextImage width={16} height={16} src={getMessengerIcon(item)} alt="" />
                      )}
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
                  <Avatar avatars={[{ alt: 'H', src: selectedBabe?.mobileUrl }]} sx={{ width: 24, height: 24 }} />
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="subtitle2" fontWeight={500} color="#646464">
                      {selectedBabe?.nickname}
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
                text={!serviceCheck(selectedServiceData?.serviceType) ? `Minimum ${2} units` : undefined}
                setCount={setCount}
                count={count || 1}
              />
            </Box>
          </Box>
          {areAllFieldsFilled && (
            <Typography variant="subtitle2" fontWeight={500} color="error">
              Please fill in the given fields
            </Typography>
          )}
          {!serviceCheck(selectedServiceData?.serviceType) && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="subtitle2" component="span">
                Search a Cafe/bistro/bar
              </Typography>
              <Autocomplete
                onPlaceChanged={onPlaceChanged}
                onLoad={onLoad}
                options={{
                  types: getRestrictions(selectedServiceData?.id),
                  fields: ['name'],
                  componentRestrictions: { country: CountryLookUpTable[state] || 'sg' },
                }}
              >
                <Input
                  fullWidth
                  size="small"
                  placeholder="Search location..."
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
                  // value={dayjs(date)}
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
                  // value={dayjs(time)}
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
          {!serviceCheck(selectedServiceData?.serviceType) && (
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
      <Toast alertMessage="Order sent!" onClose={() => setToast(false)} open={openToast} />
    </>
  );
};

export default RequestOrderModal;
