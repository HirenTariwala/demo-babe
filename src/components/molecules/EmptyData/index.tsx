import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { StringHelper } from '@/utility/stringHelper';
import React from 'react';

interface IEmptyData {
  icon: React.ReactNode;
  msg?: string;
}
const EmptyData = ({ icon, msg, ...props }: IEmptyData) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}
      {...props}
    >
      <Box textAlign={'center'}>{icon}</Box>
      <Typography
        variant={'body1'}
        fontWeight={500}
        color="#1A1A1A"
        textAlign={'center'}
        dangerouslySetInnerHTML={{ __html: StringHelper?.bubbleMessage(msg ?? '') }}
      />
    </Box>
  );
};

export default EmptyData;
