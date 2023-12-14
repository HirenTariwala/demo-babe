import React from 'react';
import Header from '../../../components/organisms/header/pageBannerHeader';
import styles from './term.module.css';
import TermsD from './components/Terms';
import Box from '@/components/atoms/box';

const Terms = () => {
  return (
    <>
      <Header title={'Terms of Services'} />
      <Box className={styles.pageContainer}>
        <TermsD />
      </Box>
    </>
  );
};

export default Terms;
