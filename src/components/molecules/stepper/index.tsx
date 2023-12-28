import React from 'react';
import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

interface IStepper {
  size?: 'small' | 'large';
  text?: string;
  count: number ;
  setCount:(arg: number)=>void
}

const Stepper = ({ text, size,count,setCount }: IStepper) => {
  return (
    <Box display="flex" alignItems="center" flexDirection="column" gap={2} maxWidth={124}>
      <Box
        display="flex"
        alignItems="center"
        width={size === 'small' ? 108 : 124}
        borderRadius={100}
        border="2px solid #CCCCCC"
        p="12px 16px"
        height={size === 'small' ? 40 : 48}
        gap={size === 'small' ? 2 : 3}
      >
        <Button
          size="small"
          variant="text"
          disabled={count <= 2}
          sx={{ p: 0, minWidth: 'inherit', color: '#646464' }}
          onClick={()=>setCount(count - 1)}
        >
          <RemoveIcon fontSize="small" />
        </Button>
        <Typography variant="body1" component="span">
          {count}
        </Typography>
        <Button
          size="small"
          variant="text"
          sx={{ p: 0, minWidth: 'inherit', color: '#646464' }}
          onClick={() => setCount(count + 1)}
        >
          <AddIcon fontSize="small" />
        </Button>
      </Box>
      {text && (
        <Typography variant="caption" component="span">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Stepper;
