import React, { ReactNode } from 'react';
import {
	MenuProps,
	Menu as MuiMenu,
	IconButton,
	SvgIconProps,
} from '@mui/material';

interface IMenu extends MenuProps {
	icon: SvgIconProps | ReactNode | any;
	setAnchorEl: (arg: any) => void;
}

const Menu = ({ icon, children, setAnchorEl, ...props }: IMenu) => {
	const handleClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setAnchorEl(event.currentTarget);
	};
	return (
		<>
			<IconButton onClick={handleClick} sx={{ p: 0 }}>
				{icon}
			</IconButton>
			<MuiMenu {...props}>{children}</MuiMenu>
		</>
	);
};

export default Menu;
