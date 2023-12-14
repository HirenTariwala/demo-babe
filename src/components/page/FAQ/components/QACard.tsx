'use client';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from '../faq.module.css';
import Box from '@/components/atoms/box';
import Typography from '@/components/atoms/typography';
import { useMediaQuery } from '@mui/material';

interface QACardProps {
  question: string;
  answer: string;
  image: string;
}

const QACard = ({ question, answer, image }: QACardProps) => {
  const [expand, setExpand] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box className={`${styles['qaCard']} ${expand ? styles['expandedCard'] : ''}`}>
      <Box
        className={styles['cardHeader']}
        onClick={() => setExpand(!expand)}
        sx={isMobile ? { cursor: 'none' } : { cursor: 'pointer' }}
      >
        <Typography variant={`${isMobile ? 'h5' : 'h4'}`} sx={{ userSelect: 'none' }}>
          {question}
        </Typography>
        <Box className={styles['toggleIcon']}>
          {expand ? <RemoveIcon className={styles['expand_icon']} /> : <AddIcon className={styles['expand_icon']} />}
        </Box>
      </Box>
      {expand && (
        <>
          <Typography
            variant={`${isMobile ? 'h6' : 'h5'}`}
            sx={!isMobile ? { padding: '12px 0', userSelect: 'none' } : { userSelect: 'none' }}
          >
            {answer}
          </Typography>
          {image && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="image" style={{ maxWidth: `${isMobile ? '100%' : '400px'}` }} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default QACard;
