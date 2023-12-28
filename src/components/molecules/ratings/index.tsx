import Box from '@/components/atoms/box';
import Star from '@/components/atoms/icons/star';
import Typography from '@/components/atoms/typography';
import { CalculatorHelper } from '@/utility/calculator';
import { Rating as MuiRating, RatingProps } from '@mui/material';

interface IRating extends RatingProps {
  ratingData: any;
}

const Rating = ({ size, value, max = 1, ratingData, ...props }: IRating) => {
  const rating = CalculatorHelper.weightedAverage(ratingData).split(' ');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MuiRating
        value={value || parseInt(rating?.[0]) || 1}
        readOnly={max === 1 ? true : false}
        max={max}
        {...props}
        icon={<Star size={size} />}
      />
      {max === 1 && (
        <>
          <Typography variant="subtitle1" fontSize={size === 'small' ? 14 : 16}>
            {rating?.[0] || '0'}
          </Typography>
          <Typography variant={size === 'small' ? 'subtitle2' : 'body1'} color="#999999">{`${
            rating?.[1] || ''
          }`}</Typography>
        </>
      )}
    </Box>
  );
};

export default Rating;
