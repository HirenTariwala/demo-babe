import { AlertProps, Alert as MuiAlert } from '@mui/material';

interface IAlert extends AlertProps {}

const Alert = ({ children, ...props }: IAlert) => {
  return <MuiAlert {...props}>{children}</MuiAlert>;
};

export default Alert;
