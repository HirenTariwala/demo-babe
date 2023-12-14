import * as React from "react";

const UploadIcon = ({...props}) => (
  <svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.66732 27.0704C4.65734 25.7249 3.33398 23.4337 3.33398 20.8333C3.33398 16.9274 6.31983 13.7188 10.1336 13.3656C10.9137 8.62022 15.0344 5 20.0007 5C24.9669 5 29.0876 8.62022 29.8677 13.3656C33.6815 13.7188 36.6673 16.9274 36.6673 20.8333C36.6673 23.4337 35.344 25.7249 33.334 27.0704M13.334 26.6667L20.0007 20M20.0007 20L26.6673 26.6667M20.0007 20V35"
      stroke="#1A1A1A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default UploadIcon;