import * as React from 'react';

const EditIcon = ({ ...props }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white" />
    <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#CCCCCC" />
    <path
      d="M16 21.3341H22M10 21.3341H11.1164C11.4425 21.3341 11.6056 21.3341 11.759 21.2973C11.8951 21.2646 12.0251 21.2108 12.1444 21.1377C12.279 21.0552 12.3943 20.9399 12.6249 20.7093L21 12.3341C21.5523 11.7819 21.5523 10.8864 21 10.3341C20.4478 9.78185 19.5523 9.78185 19 10.3341L10.6249 18.7093C10.3943 18.9399 10.279 19.0552 10.1965 19.1898C10.1234 19.3091 10.0695 19.4391 10.0369 19.5752C10 19.7286 10 19.8917 10 20.2178V21.3341Z"
      stroke="#1A1A1A"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export default EditIcon;
