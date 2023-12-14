import * as React from "react";

const BackIcon = ({size= 16, ...props}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M12.6654 7.9987H3.33203M3.33203 7.9987L7.9987 12.6654M3.33203 7.9987L7.9987 3.33203"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default BackIcon;