// import { tabs } from '@/common/utils/data';
import Box from '@/components/atoms/box';
import CheckBox from '@/components/atoms/checkbox';
import DotIcon from '@/components/atoms/icons/dotIcon';
import Typography from '@/components/atoms/typography';
import React, { useEffect } from 'react';
import Price from '@/components/molecules/price';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TabChip from '../../Rent/components/favouritechip';
import { Item } from '@/props/profileProps';
import NextImage from '@/components/atoms/image';
import { ServiceHelper } from '@/utility/serviceHelper';
import { useDispatch } from 'react-redux';
import { setSelectedServices } from '@/store/reducers/serviceReducer';

interface ITabContent {
  activeTab: number;
  data: any;
  babeInfo: Item;
  isMobile: boolean;
  setActiveTab: (arg: number) => void;
}

const TabContent = ({ activeTab, setActiveTab, data, babeInfo, isMobile }: ITabContent) => {
  const { emeets } = babeInfo;
  const dispatch = useDispatch()
  const servicesKeyId = Object.keys(data);
  const temp = Object.keys(data).map((key) => data[key]);
  const handleTabChange = (e: number) => {
    setActiveTab(e);
    dispatch(setSelectedServices(temp[e]))
  };

  const suffix = temp[activeTab]?.suffix ?? ServiceHelper.getDefaultSuffix(parseInt(servicesKeyId[activeTab])) 

  useEffect(()=>{
   dispatch(setSelectedServices(temp[0]))
  },[])

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {temp?.[activeTab]?.image.includes('EMEET') && (
        <Box display="flex" alignItems="center" gap={2}>
          <CheckBox
            label={
              <Typography variant="body2" component="span">
                Texting
              </Typography>
            }
            disabled
            defaultChecked={emeets?.pref?.includes('text')}
            sx={{
              '&.Mui-checked': {
                color: '#4CAF4F',
              },
              '&.css-j204z7-MuiFormControlLabel-root': {
                border: '2px solid red',
              },
            }}
            icon={<CheckCircleRoundedIcon fontSize="small" />}
            checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
          />
          <DotIcon />
          <CheckBox
            label={
              <Typography variant="body2" component="span">
                Audio
              </Typography>
            }
            disabled
            defaultChecked={emeets?.pref?.includes('audio')}
            sx={{
              '&.Mui-checked': {
                color: '#4CAF4F',
              },
            }}
            icon={<CheckCircleRoundedIcon fontSize="small" />}
            checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
          />
          <DotIcon />
          <CheckBox
            label={
              <Typography variant="body2" component="span">
                Video calls
              </Typography>
            }
            defaultChecked={emeets?.pref?.includes('video')}
            sx={{
              '&.Mui-checked': {
                color: '#4CAF4F',
              },
            }}
            disabled
            icon={<CheckCircleRoundedIcon fontSize="small" />}
            checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
          />
        </Box>
      )}
      <Box
        display={'flex'}
        gap={4}
        mt={temp?.[activeTab]?.image.includes('EMEET') ? 'unset' : 3}
        sx={{
          width: '100%',
          overflowX: 'auto',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {temp?.map((item, index) => {
          return (
            <TabChip
              key={index}
              icon={item?.image}
              label={item?.title}
              isActive={activeTab === index}
              onClick={() => handleTabChange(index)}
            />
          );
        })}
      </Box>
      {isMobile ? (
        <Box display="flex" gap={3} flexDirection={'column'}>
          <Box display="flex" gap={3} flexDirection="column">
            <Price
              priceData={{
                price: temp?.[activeTab]?.price,
                min: temp?.[activeTab]?.price,
                max: temp?.[activeTab]?.price,
                hr: ServiceHelper.convertUnits(suffix),
              }}
              category="1"
            />
            <Typography variant="body1" component="span">
              {temp?.[activeTab]?.description}
            </Typography>
          </Box>
          <Box width={'100%'} height={225} position={'relative'}>
            <NextImage
              src={temp?.[activeTab]?.image}
              layout="fill"
              objectFit="cover"
              // objectFit="contain-fit"
              alt=""
              style={{ borderRadius: 12 }}
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" gap={3}>
          <Box width={424} height={225} overflow={'hidden'} position={'relative'}>
            <NextImage
              src={temp?.[activeTab]?.image}
              layout="fill"
              objectFit="cover"
              alt=""
              style={{ borderRadius: 12 }}
            />
          </Box>
          <Box display="flex" gap={3} flexDirection="column">
            <Price
              priceData={{
                price: temp?.[activeTab]?.price,
                min: temp?.[activeTab]?.price,
                max: temp?.[activeTab]?.price,
                hr:  ServiceHelper.convertUnits(suffix),
              }}
              category="1"
            />
            <Typography variant="body1" component="span">
              {temp?.[activeTab]?.description}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TabContent;
