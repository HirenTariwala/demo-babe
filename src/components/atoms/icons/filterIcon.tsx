import * as React from 'react';

const FiltrerIcon = ({ size = 20, ...props }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
		<path
			d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
			stroke="#1A1A1A"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export default FiltrerIcon;
