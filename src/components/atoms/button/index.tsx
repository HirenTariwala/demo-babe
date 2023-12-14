import { ButtonProps, Button as MuiButton } from '@mui/material';
import LoadingIcon from '../icons/loading';

interface ButtonInterface extends ButtonProps {
	loading?: boolean;
}

const Button = ({
	disabled,
	loading = false,
	children,
	...props
}: ButtonInterface) => {
	return (
		<MuiButton
			{...props}
			disabled={loading || disabled}
			endIcon={loading && <LoadingIcon size={18} />}
		>
			{children}
		</MuiButton>
	);
};

export default Button;
