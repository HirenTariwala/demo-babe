import Alert from '@/components/atoms/alert';
import { AlertProps, Snackbar, SnackbarProps } from '@mui/material';
import { forwardRef } from 'react';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SuccessIcon from '@/components/atoms/icons/successIcon';

interface IToast extends SnackbarProps {
  alertMessage: string;
}

const ToastMessage = forwardRef<HTMLDivElement, AlertProps>(function AlertComp(props, ref) {
  return <Alert {...props} ref={ref} />;
});

const Toast = ({ alertMessage, autoHideDuration = 5000, ...props }: IToast) => {
  return (
    <Snackbar {...props} autoHideDuration={autoHideDuration}>
      <div>
        <ToastMessage
          sx={{
            width: '100%',
            borderRadius: '100px',
            background: '#1A1A1A',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            height: '48px',
          }}
          icon={<SuccessIcon />}
        >
          {alertMessage}
        </ToastMessage>
      </div>
    </Snackbar>
  );
};

export default Toast;
