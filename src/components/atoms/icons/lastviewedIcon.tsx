import * as React from "react";

const LastViewIcon = ({...props}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <path
      d="M21.1198 12.8928C20.8419 15.5027 19.3632 17.9484 16.9162 19.3612C12.8507 21.7084 7.65216 20.3155 5.30495 16.25L5.05495 15.817M4.21267 11.1071C4.49047 8.49723 5.96926 6.05151 8.41625 4.63874C12.4817 2.29153 17.6803 3.68447 20.0275 7.74995L20.2775 8.18297M4.15967 18.0659L4.89172 15.3339L7.62377 16.0659M17.7087 7.93398L20.4408 8.66603L21.1728 5.93398M12.6662 7.49995V12L15.1662 13.5"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default LastViewIcon;
