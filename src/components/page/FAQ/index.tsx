'use client';
import React from 'react';
import Header from '../../organisms/header/pageBannerHeader';
import Tabs from '@/components/atoms/tabs';
import { Box } from '@mui/material';
import QACard from './components/QACard';
import styles from './faq.module.css';
import { useTranslations } from 'next-intl';
import useFaqHook from './useFaqHook';

const FAQPage = () => {
  const {data,isMobile,isTablet} = useFaqHook()
  const t = useTranslations('faqPage.tabLabel')
  const FAQ_TABS = [
    {
      content: (
        <Box className={styles.qa_tabs}>
          {data?.filter((item) => item.type === 'general')?.map((item, index) => {
            return <QACard key={index} question={item?.question} answer={item?.answer} image={item?.image} />;
          })}
        </Box>
      ),
      lable: () => t('general'),
    },
    {
      content: (
        <Box className={styles.qa_tabs}>
          {data?.filter((item) => item.type === 'how to rent?')?.map((item, index) => {
            return <QACard key={index} question={item?.question} answer={item?.answer} image={item?.image} />;
          })}
        </Box>
      ),
      lable: () => t('howToRent'),
    },
    {
      content: (
        <Box className={styles.qa_tabs}>
          {data?.filter((item) => item.type === 'rules')?.map((item, index) => {
            return <QACard key={index} question={item?.question} answer={item?.answer} image={item?.image} />;
          })}
        </Box>
      ),
      lable: () => t('rules'),
    },
    {
      content: (
        <Box className={styles.qa_tabs}>
          {data?.filter((item) => item.type === 'refunds')?.map((item, index) => {
            return <QACard key={index} question={item?.question} answer={item?.answer} image={item?.image} />;
          })}
        </Box>
      ),
      lable: () => t('refunds'),
    },
    {
      content: (
        <Box className={styles.qa_tabs}>
          {data?.filter((item) => item.type === 'credit')?.map((item, index) => {
            return <QACard key={index} question={item?.question} answer={item?.answer} image={item?.image} />;
          })}
        </Box>
      ),
      lable: () => t('credits'),
    },
  ];

  return (
    <>
      <Header title={'Frequently Ask Questions'} />
      <Box margin={`${isMobile ? '20px 16px' : isTablet ? '20px 40px' : '36px 240px'}`}>
        <Tabs tabsData={FAQ_TABS} mainClass={'main_tabs'} tabsLabel={'tabs_label'} />
      </Box>
    </>
  );
};

export default FAQPage;
