'use client';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import React from 'react';
import { Divider } from '@mui/material';
import InputPhone from '@/components/molecules/phoneinput';
import CheckBox from '@/components/atoms/checkbox';
import Button from '@/components/atoms/button';
import GoogleIcon from '@/components/atoms/icons/googleIcon';
import useLoginHook from './useLoginHook';
import Input from '@/components/atoms/input';
import styles from './form.module.css';
import Timer from './Timer';

const LoginForm = () => {
  const {
    loading,
    number,
    code,
    check,
    isVerified,
    isReSend,
    isWrongCode,
    timer,
    setNumber,
    setCode,
    setCheck,
    googleSignIn,
    phoneNumberSignIn,
    verifyPressed,
    onEditPhone,
  } = useLoginHook();
  return (
    <Box display={'flex'} flexDirection={'column'} gap={'24px'}>
      <Box display={'flex'} flexDirection={'column'} gap={'12px'}>
        <Typography component="span" variant="h2">
          {!isVerified ? 'Welcome to Rentbabe' : 'Phone verification'}
        </Typography>
        {!isVerified ? (
          <Typography color="#646464" component="span" variant="body1">
            Please login to proceed
          </Typography>
        ) : (
          <Typography color="#646464" component="span" variant="body1">
            {isReSend ? 'Another code has been sent to' : 'Please enter the code that was sent to'}
            <Typography color="#1A1A1A" component="span" variant="subtitle1" whiteSpace={'nowrap'}>
              {` +${number}. `}
            </Typography>
            {isReSend && 'Please enter the verification code here.'}
            <Typography
              color="#2874f0"
              component="span"
              variant="subtitle1"
              sx={{
                cursor: 'pointer',
              }}
              whiteSpace={'nowrap'}
              onClick={onEditPhone}
            >
              Change
            </Typography>
          </Typography>
        )}
      </Box>
      {!isVerified ? (
        <Box textAlign={'left'}>
          <InputPhone value={number} setValue={setNumber} label={'Phone number'} />
          <CheckBox
            label={
              <Typography component="span" variant="body1" color="#646464">
                I am over 18 years old
              </Typography>
            }
            checked={check}
            onChange={() => {
              setCheck(!check);
            }}
          />
        </Box>
      ) : (
        <Box textAlign={'left'} display={'flex'} flexDirection={'column'} gap={2}>
          <Typography color="#1A1A1A" component="span" variant="subtitle2">
            Phone verification code
          </Typography>
          <Input
            type="number"
            sx={{
              '.MuiInputBase-input': {
                padding: '10px',
              },
              width: '100%',
            }}
            placeholder="Enter your code"
            value={code}
            onChange={(e) => {
              if (e.target.value?.length <= 6) setCode(e.target.value);
            }}
            error={isWrongCode}
          />
          {isWrongCode && (
            <Typography color="#E32D2D" component="span" variant="subtitle2">
              The verification code is incorrect. Please try again.
            </Typography>
          )}

          <Timer value={'Didn’t receive the code?'} timer={timer} phoneNumberSignIn={phoneNumberSignIn} />
        </Box>
      )}
      <Box>
        <Button
          color="primary"
          size="medium"
          startIcon={null}
          className={styles.sendCodeButton}
          disabled={isVerified ? !code : !check || !number}
          variant="contained"
          onClick={isVerified ? verifyPressed : phoneNumberSignIn}
          loading={loading}
        >
          {isVerified ? 'Verify' : 'Send Code'}
        </Button>
      </Box>
      {!isVerified && (
        <Box>
          <Divider color="#F0F0F0">
            <Typography color="#ccc" component="span" variant="subtitle2">
              {' '}
              OR{' '}
            </Typography>
          </Divider>
        </Box>
      )}
      {!isVerified && (
        <Box>
          <Button
            color="secondary"
            onClick={googleSignIn}
            size="medium"
            startIcon={null}
            className={styles.googleButton}
            variant="outlined"
          >
            <Box display={'flex'} justifyContent={'cneter'} alignItems={'center'} gap={'8px'}>
              <GoogleIcon />
              <Typography color="black" component="span" variant="subtitle1">
                Continue with Google
              </Typography>
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LoginForm;
