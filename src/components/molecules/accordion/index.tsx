import React, { useState } from 'react';
import Typography from '@/components/atoms/typography';
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  AccordionProps,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@/components/atoms/box';

interface IAccordion extends AccordionProps {
    accordionData: any;
}

const Accordion = ({accordionData, ...props }: IAccordion) => {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <Box maxWidth={960}>
      <MuiAccordion
        {...props}
        sx={{
          boxShadow: 'none',
          background: isOpen ? '#F0F0F0' : 'none',
          borderRadius: 4,
          p: 1,
        }}
        onChange={() => setIsOpen(!isOpen)}
      >
        <AccordionSummary expandIcon={isOpen ? <RemoveIcon /> : <AddIcon />}>
          <Typography variant="h4" component="span" fontWeight={500}>
            {accordionData.label}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" component="span">
            {accordionData.summary}
          </Typography>
        </AccordionDetails>
      </MuiAccordion>
    </Box>
  );
};

export default Accordion;
