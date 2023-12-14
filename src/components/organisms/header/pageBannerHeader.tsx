'use client';
import React from 'react';
import styles from './header.module.css';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { useMediaQuery } from '@mui/material';

interface PropsType {
  title: string;
}

const PageBannerHeader = ({ title }: PropsType) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Box className={styles.page_header_body}>
        <Typography variant={`${isMobile ? 'h2' : 'h1'}`}>{title}</Typography>
      </Box>
    </>
  );
};

export default PageBannerHeader;
