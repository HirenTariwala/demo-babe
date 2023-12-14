'use client';
import React, { useEffect, useState } from 'react';
import { Tabs as MuiTabs, Tab, TabsOwnProps } from '@mui/material';
import Box from '../box';
import Typography from '../typography';
import styles from '../../page/FAQ/faq.module.css';

interface ITab extends TabsOwnProps {
  tabsData: any;
  mainClass?: string;
  tabsLabel?: string;
  tabBottomPadding?: any;
  resetTab?: number | string;
}

type TabContentPanelProps = {
  value: number;
  index: number;
  children: React.ReactNode;
};

function TabContentPanel(props: TabContentPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Tabs = ({ tabsData, tabBottomPadding, resetTab, mainClass, tabsLabel, ...props }: ITab) => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    setValue(0);
  }, [resetTab]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: tabBottomPadding || '0px',
      }}
    >
      <MuiTabs
        {...props}
        value={value}
        onChange={handleChange}
        scrollButtons="auto"
        allowScrollButtonsMobile
        className={mainClass ? styles[mainClass] : ''}
      >
        {tabsData?.map((tab: any, index: number) => (
          <Tab
            key={index}
            sx={{
              textTransform: 'none',
              fontFamily: `'Helvetica Neue', sans-serif`,
            }}
            label={tab.lable}
            className={tabsLabel ? styles[tabsLabel] : ''}
          />
        ))}
      </MuiTabs>
      {tabsData.map((tab: any, index: number) => (
        <TabContentPanel key={index} value={value} index={index}>
          <Typography sx={{ textTransform: 'none', fontFamily: `'Helvetica Neue', sans-serif` }}>
            {tab.content}
          </Typography>
        </TabContentPanel>
      ))}
    </Box>
  );
};

export default Tabs;
