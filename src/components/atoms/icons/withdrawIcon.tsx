import * as React from 'react';

const WithdrawIcon = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <path
      d="M9 14.6667C9 15.9553 10.0447 17 11.3333 17H13.5C14.8807 17 16 15.8807 16 14.5C16 13.1193 14.8807 12 13.5 12H11.5C10.1193 12 9 10.8807 9 9.5C9 8.11929 10.1193 7 11.5 7H13.6667C14.9553 7 16 8.04467 16 9.33333M12.5 5.5V7M12.5 17V18.5M22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12Z"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default WithdrawIcon;
