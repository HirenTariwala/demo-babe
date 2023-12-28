import * as React from 'react';

const DollerIcon = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M5 13.3307C5 15.1717 6.49238 16.6641 8.33333 16.6641H11.6667C13.5076 16.6641 15 15.1717 15 13.3307C15 11.4898 13.5076 9.9974 11.6667 9.9974H8.33333C6.49238 9.9974 5 8.50501 5 6.66406C5 4.82311 6.49238 3.33073 8.33333 3.33073H11.6667C13.5076 3.33073 15 4.82311 15 6.66406M10 1.66406V18.3307"
      stroke="#1A1A1A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default DollerIcon;
