import Box, { IBox } from '@/components/atoms/box';
import PriceLogo from '@/components/atoms/icons/priceLogo';
import Typography from '@/components/atoms/typography';
import { TPrice } from './types';

interface IPrice extends IBox {
  priceData: TPrice;
  size?: string;
  category?: string;
}

const Price = ({ priceData, size, category, ...props }: IPrice) => {
  let decimalPoint: string = '00';

  if (category) {
    decimalPoint = (priceData?.price / 100)?.toFixed(2)?.split('.')[1];
  } else {
    decimalPoint = (priceData?.max / 100)?.toFixed(2)?.split('.')[1];
  }
  priceData.price = parseInt((priceData?.price / 100)?.toFixed(2)?.split('.')[0]) || 0;
  priceData.min = parseInt((priceData?.min / 100)?.toFixed(2)?.split('.')[0]) || 0;
  priceData.max = parseInt((priceData?.max / 100)?.toFixed(2)?.split('.')[0]) || 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} {...props}>
      <>
        <PriceLogo size={size === 'small' ? 20 : 24} />
        {/* {priceData.min ? ( */}
        <>
          <Typography variant="h3" component="span" fontSize={size === 'small' ? 16 : 20} whiteSpace={'nowrap'}>
            {category ? `${priceData?.price || '00'}` : `${priceData?.min || '00'} ~ ${priceData?.max || '00'}`}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            fontSize={size === 'small' ? 12 : 14}
            style={{ marginLeft: -4, marginTop: size === 'small' ? 0 : 4 }}
          >{`.${decimalPoint || '00'}/${priceData?.hr}`}</Typography>{' '}
        </>
        {/* ) : (
          '--'
        )} */}
      </>
    </Box>
  );
};

export default Price;
