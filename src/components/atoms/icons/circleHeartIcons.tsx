import * as React from 'react';

const CircleHeartIcons = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
    <g clipPath="url(#clip0_964_160722)">
      <path
        d="M10.0003 18.3307C14.6027 18.3307 18.3337 14.5998 18.3337 9.9974C18.3337 5.39502 14.6027 1.66406 10.0003 1.66406C5.39795 1.66406 1.66699 5.39502 1.66699 9.9974C1.66699 14.5998 5.39795 18.3307 10.0003 18.3307Z"
        stroke="#1A1A1A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99747 7.55399C9.16441 6.58006 7.77522 6.31808 6.73145 7.2099C5.68768 8.10172 5.54073 9.5928 6.36041 10.6476C6.88542 11.3231 8.22998 12.5759 9.12886 13.3894C9.42756 13.6597 9.57692 13.7948 9.75581 13.849C9.9096 13.8956 10.0853 13.8956 10.2391 13.849C10.418 13.7948 10.5674 13.6597 10.8661 13.3894C11.765 12.5759 13.1095 11.3231 13.6345 10.6476C14.4542 9.5928 14.3252 8.09234 13.2635 7.2099C12.2018 6.32746 10.8305 6.58006 9.99747 7.55399Z"
        stroke="#1A1A1A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_964_160722">
        <rect width={20} height={20} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default CircleHeartIcons;
