import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/input';
import Typography from '@/components/atoms/typography';
import '../../../../app/globals.css';
import { Item } from '@/props/profileProps';
import {
  Avatar,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

const SearchCard: React.FC<{
  user: Item;
}> = ({ user }) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/profile/${user.uid}`);
  };
  return (
    <Card elevation={4} onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CardHeader
        avatar={<Avatar src={user?.urls?.[0] || user?.mobileUrl} variant="circular" />}
        title={`@${user.nickname}`}
        // subheader= {<Typography color="error" variant='caption'>
        //     {`Last seen ${ (Helper.timeSince(user?.time_stamp?.toDate()) ).toLowerCase() } ago`}
        // </Typography>}
      />
    </Card>
  );
};
interface IOptionsData {
  label: string | React.ReactNode;
  key: string;
  value: string;
}
interface IFilterModal {
  filterIsOpen: boolean;
  onCloseFilter: () => void;
  time: any;
  data: Item | undefined;
  nickname: string | undefined;
  reset: boolean;
  handleSearch: (arg: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  activeLocation: string;
  activeRecently: string;
  activePublic: string;
  activeGender: string;
  activeCity: string;
  locationData: IOptionsData[];
  recentlySelectionData: IOptionsData[];
  publicSelectionData: IOptionsData[];
  genderSelectionData: IOptionsData[];
  EthnicityData: IOptionsData[];
  handleLocationChange: (event: SelectChangeEvent) => void;
  handleRecentlyChange: (event: SelectChangeEvent) => void;
  handlePublicChange: (event: SelectChangeEvent) => void;
  handleGenderChange: (event: SelectChangeEvent) => void;
  handleEthnicityChange: (event: SelectChangeEvent) => void;
  handleApply: () => void;
  setActiveLocation: (location: string) => void;
}

const FilterModal = ({
  filterIsOpen,
  onCloseFilter,
  time,
  data,
  nickname,
  reset,
  handleSearch,
  activeLocation,
  activeRecently,
  activePublic,
  activeGender,
  activeCity,
  locationData,
  recentlySelectionData,
  publicSelectionData,
  genderSelectionData,
  EthnicityData,
  handleLocationChange,
  handleRecentlyChange,
  handlePublicChange,
  handleGenderChange,
  handleEthnicityChange,
  handleApply,
  setActiveLocation,
}: IFilterModal) => {
  const placesLibrary = ['places'];
  const [searchResult, setSearchResult] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY,
    libraries: placesLibrary,
  } as any);

  const onLoad = (autocomplete: any) => {
    setSearchResult(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchResult != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const place = searchResult.getPlace();
      const name = place.name;
      setActiveLocation(name);
    } else {
      alert('Please enter text');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <Dialog
      open={filterIsOpen}
      onClose={onCloseFilter}
      scroll={'paper'}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{
        '.MuiPaper-root': {
          borderRadius: '24px',
          margin: '30px 16px',
        },
      }}
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          padding: '16px',
        }}
      >
        <Typography variant="h4" fontWeight={500}>
          Filter
        </Typography>
      </DialogTitle>
      <DialogContent
        // dividers={true}
        sx={{
          padding: '0px 16px',
        }}
      >
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <Box display={'flex'} gap={4} flexDirection={'column'}>
            <Box>
              <Typography variant="body1" fontWeight={500} color={'#1A1A1A'} paddingBottom={3}>
                Find username{' '}
              </Typography>
              <Input
                fullWidth
                size="small"
                placeholder="Enter username"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!!time && <CircularProgress color="primary" size={18} />}
                    </InputAdornment>
                  ),
                }}
                inputProps={{ sx: { padding: '12px 24px' } }}
                helperText={
                  !time && !data && nickname ? (reset ? '' : 'Not found') : data && <SearchCard user={data} />
                }
                onChange={handleSearch}
              />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={500} color={'#1A1A1A'} paddingBottom={3}>
                Location
              </Typography>
              <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                <Input
                  fullWidth
                  size="small"
                  placeholder="Find location"
                  inputProps={{ sx: { padding: '12px 24px' } }}
                />
              </Autocomplete>
              <RadioGroup
                row
                name="row-radio-buttons-group"
                sx={{
                  '.MuiFormControlLabel-root': {
                    marginLeft: '0px',
                    marginRight: '0px',
                    maxHeight: '100%',
                  },
                  // '.MuiSvgIcon-root': {
                  //   color: '#CCC',
                  // },
                  '.MuiTypography-root': {
                    color: '#646464',
                  },
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
                value={activeLocation}
                onChange={handleLocationChange}
              >
                {locationData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      sx={{
                        maxHeight: '24px',
                      }}
                      value={item?.value}
                      control={<Radio size="small" checkedIcon={<CheckCircleRoundedIcon />} />}
                      label={item?.key}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={500} color={'#1A1A1A'} paddingBottom={3}>
                Sort by
              </Typography>

              <RadioGroup
                row
                name="row-radio-buttons-group"
                sx={{
                  '.MuiFormControlLabel-root': {
                    marginLeft: '0px',
                    marginRight: '0px',
                    maxHeight: '100%',
                  },
                  // '.MuiSvgIcon-root': {
                  //   color: '#CCC',
                  // },
                  '.MuiTypography-root': {
                    color: '#646464',
                  },
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
                value={activeRecently}
                onChange={handleRecentlyChange}
              >
                {recentlySelectionData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={item?.value}
                      control={<Radio size="small" checkedIcon={<CheckCircleRoundedIcon />} />}
                      label={item?.key}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={500} color={'#1A1A1A'} paddingBottom={3}>
                Privacy
              </Typography>

              <RadioGroup
                row
                name="row-radio-buttons-group"
                sx={{
                  '.MuiFormControlLabel-root': {
                    marginLeft: '0px',
                    marginRight: '0px',
                    maxHeight: '100%',
                  },
                  // '.MuiSvgIcon-root': {
                  //   color: '#CCC',
                  // },
                  '.MuiTypography-root': {
                    color: '#646464',
                  },
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
                value={activePublic}
                onChange={handlePublicChange}
              >
                {publicSelectionData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={item?.value}
                      control={<Radio size="small" checkedIcon={<CheckCircleRoundedIcon />} />}
                      label={item?.key}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={500} color={'#1A1A1A'} paddingBottom={3}>
                Gender
              </Typography>

              <RadioGroup
                row
                name="row-radio-buttons-group"
                sx={{
                  '.MuiFormControlLabel-root': {
                    marginLeft: '0px',
                    marginRight: '0px',
                    maxHeight: '100%',
                  },
                  // '.MuiSvgIcon-root': {
                  //   color: '#CCC',
                  // },
                  '.MuiTypography-root': {
                    color: '#646464',
                  },
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
                value={activeGender}
                onChange={handleGenderChange}
              >
                {genderSelectionData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={item?.value}
                      control={<Radio size="small" checkedIcon={<CheckCircleRoundedIcon />} />}
                      label={item?.key}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={500} color={'#1A1A1A'} paddingBottom={3}>
                Ethnicity
              </Typography>

              <RadioGroup
                row
                name="row-radio-buttons-group"
                sx={{
                  '.MuiFormControlLabel-root': {
                    marginLeft: '0px',
                    marginRight: '0px',
                    maxHeight: '100%',
                  },
                  // '.MuiSvgIcon-root': {
                  //   color: '#CCC',
                  // },
                  '.MuiTypography-root': {
                    color: '#646464',
                  },
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
                value={activeCity}
                onChange={handleEthnicityChange}
              >
                {EthnicityData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={item?.value}
                      control={<Radio size="small" checkedIcon={<CheckCircleRoundedIcon />} />}
                      label={item?.key}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: '16px',
        }}
      >
        <Button
          color="primary"
          size="medium"
          startIcon={null}
          sx={{
            borderRadius: 50,
            fontSize: '16px',
            fontWeight: 700,
            padding: '12px 20px',
            textTransform: 'none',
          }}
          variant="outlined"
          onClick={onCloseFilter}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="medium"
          startIcon={null}
          sx={{
            borderRadius: 50,
            fontSize: '16px',
            fontWeight: 700,
            padding: '12px 20px',
            textTransform: 'none',
          }}
          variant="contained"
          onClick={handleApply}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
