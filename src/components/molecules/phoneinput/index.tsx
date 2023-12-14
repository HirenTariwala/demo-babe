import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import styles from './phone.module.css';
import Box, { IBox } from '@/components/atoms/box';
import { Typography } from '@mui/material';

interface IPhoneInput extends IBox {
  label?: string;
  value: string;
  setValue(value: string): void;
}

const InputPhone = ({ label, value, setValue, ...props }: IPhoneInput) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap={1}
      sx={{
        '& .react-tel-input .country-list .country:hover': {
          backgroundColor: '#F0F0F0) ',
          borderRadius: '12px',
        },
        '.react-tel-input .selected-flag.open:before': {
          boxShadow: 'none',
          borderColor: '#CCC',
          border: 'none',
        },
      }}
      {...props}
    >
      {label && (
        <Typography variant="subtitle2" component="span" fontWeight={500}>
          {label}
        </Typography>
      )}
      <PhoneInput
        country={'us'}
        value={value}
        onChange={(e) => setValue(e)}
        inputStyle={{
          borderRadius: '100px',
          padding: '12px 60px',
          width: '100%',
        }}
        inputClass={styles.phoneInput}
        onFocus={(e) => {
          e.target.style.borderColor = '#CCC';
          e.target.style.boxShadow = 'none';
        }}
        dropdownStyle={{
          padding: '20px',
          borderRadius: '16px',
        }}
        dropdownClass={styles.dropdownPhone}
      />
    </Box>
  );
};

export default InputPhone;
