import * as React from 'react';

const ArrowForwardIcon = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M9 18L15 12L9 6" stroke="#1A1A1A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export default ArrowForwardIcon;
