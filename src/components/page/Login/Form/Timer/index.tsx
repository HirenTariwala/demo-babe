import Box from '@/components/atoms/box';
// import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import React from 'react';

interface ITimer {
  value: string;
  timer: number;
  phoneNumberSignIn: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Timer = ({ value, timer, phoneNumberSignIn }: ITimer) => {
  return (
    <div>
      <Box display={'flex'} justifyContent={'end'}>
        {timer > 0 ? (
          <Typography color="#1A1A1A" component="span" variant="subtitle2">
            {`0:${timer <= 9 ? `0${timer}` : timer}`}
          </Typography>
        ) : (
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <Typography color="#1A1A1A" component="span" variant="subtitle2" display={'flex'} justifyContent={'end'}>
              Didn’t receive the code?
            </Typography>
            {!timer && (
              <Typography
                color="#1A1A1A"
                component="span"
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 500,
                }}
                onClick={phoneNumberSignIn}
              >
                Resend
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Timer;
