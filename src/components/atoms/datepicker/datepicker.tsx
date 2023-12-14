import React from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DateTimePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoItem>
        <DatePicker format="MMMM DD,YYYY" sx={{ background: '#fff', borderRadius: '100px' }} />
      </DemoItem>
    </LocalizationProvider>
  );
};
export default DateTimePicker;
