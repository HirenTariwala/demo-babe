import Box, { IBox } from '@/components/atoms/box';
import React from 'react';
import StatusTag from '@/components/atoms/chip/statustags';
import { getColor } from '@/common/utils/getcolor';
import Typography from '@/components/atoms/typography';
import { json, jsonMonthly } from './subscriptionData';

interface ISubscriptionCard extends IBox {
  size?: 'small' | 'large';
  isActive?: boolean;
  priceID: string;
  discount?: number | undefined;
  onClickCard: (i: number, priceID: string, finalPrice: any) => void;
  index: number;
  finalPrice: number;
}

const SubscriptionCard = ({
  index,
  onClickCard,
  size,
  priceID,
  finalPrice,
  discount = 1,
  isActive = false,
  ...props
}: ISubscriptionCard) => {
  const multipleOf = jsonMonthly[index] as number;

  const onClickHandler = () => {
    const finalPrice = discount ? (json[index] * discount).toFixed(2) : (json[index] as number).toFixed(2);
    onClickCard(index, priceID, finalPrice);
  };

  const newAmount = ((Math.round((json[index] / multipleOf) * 100) / 100) * discount).toFixed(2);
  const oldAMount = (Math.round((json[index] / multipleOf) * 100) / 100).toFixed(2);

  return (
    <Box position={'relative'} display={'flex'} justifyContent={'center'} flexDirection={'column'} minHeight={'230px'}>
      <Typography
        hidden={!(index === 1)}
        sx={{
          padding: '4px 10px',
          position: 'absolute',
          // top: '-0.4em',
          top: '-12px',
          borderRadius: '260px',
          background: '#FFD443',
          whiteSpace: 'nowrap',
          width: '55%',
          maxWidth: '126px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        variant="body2"
        component="span"
        color={'#1A1A1A'}
      >
        MOST POPULAR
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        p={size === 'small' ? '24px 20px' : '32px 20px'}
        flexDirection="column"
        gap={6}
        border={isActive ? '3px solid #FFD443' : '1px solid #CCC'}
        borderRadius={4}
        width={'100%'}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            border: '3px solid #FFD443',
          },
        }}
        onClick={onClickHandler}
        {...props}
      >
        <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
          <Typography variant="h4" component="span" fontWeight={500}>
            {multipleOf} month{multipleOf === 1 ? '' : 's'}
          </Typography>
          <StatusTag
            size="small"
            label={
              <Typography variant="subtitle2" component="span" fontWeight={500}>
                {`${((1 - discount) * 100).toFixed(0)}% off`}
              </Typography>
            }
            style={getColor('info')}
            sx={{ borderRadius: '100px' }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '3px',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2" component="span" fontWeight={500}>{`$`}</Typography>
            <Typography
              variant="subtitle2"
              component="span"
              fontWeight={500}
              lineHeight={'80%'}
              letterSpacing={'-1px'}
              fontSize={42}
            >{`${newAmount?.split('.')[0]}`}</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
              }}
            >
              <Typography variant="subtitle2" component="span" fontWeight={500}>{`.${
                newAmount?.split('.')[1]
              } USD`}</Typography>
              <Typography variant="subtitle2" component="span" fontWeight={500} color={'#999'}>
                <s>{`$ ${oldAMount}`}</s>
              </Typography>
            </Box>
          </Box>
          <Box textAlign={'center'}>
            <Typography variant="body2" component="span" color={'#646464'}>{`first ${
              multipleOf === 1 ? '' : multipleOf
            } month${multipleOf === 1 ? '' : 's'}`}</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          marginTop: '12px',
          height: '32px',
        }}
      >
        <Typography variant="body2" component="span" color={'#646464'}>
          {isActive ? `$${finalPrice} billed today` : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export default SubscriptionCard;
