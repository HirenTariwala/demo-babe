import Box from '@/components/atoms/box';
import Button from '@/components/atoms/button';
import { SetStateAction, useState } from 'react';

interface IUseWithdrawnHook {
  isVerified: boolean;
  withdrawModalChanges: () => void;
}
const useWithdrawnHook = ({ isVerified, withdrawModalChanges }: IUseWithdrawnHook) => {
  const [isDisable, setIsDisable] = useState(true);
  const [unVerifiedObj, setUnVerifiedObj] = useState<{
    frontId?: any;
    backId?: any;
    isIUnderstand?: boolean;
    isIConsent?: boolean;
  }>({
    frontId: null,
    backId: null,
    isIUnderstand: isVerified,
    isIConsent: isVerified,
  });

  const WithdrawnFooter = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
      }}
    >
      <Button
        color="primary"
        onClick={withdrawModalChanges}
        size="medium"
        startIcon={null}
        sx={{
          borderRadius: 50,
          fontSize: '16px',
          fontWeight: 700,
          padding: '12px 20px',
          textTransform: 'none',
        }}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={withdrawModalChanges}
        size="medium"
        startIcon={null}
        sx={{
          borderRadius: 50,
          fontSize: '16px',
          fontWeight: 700,
          padding: '12px 20px',
          textTransform: 'none',
        }}
        disabled={isDisable}
        variant="contained"
      >
        {/* eslint-disable-next-line no-constant-condition */}
        {isVerified ? 'Withdraw' : 'Done'}
      </Button>
    </Box>
  );
  const setUnVerifiedObjChange = (
    e: SetStateAction<{
      frontId?: string | ArrayBuffer | null;
      backId?: string | ArrayBuffer | null;
      isIUnderstand?: boolean;
      isIConsent?: boolean;
    }>
  ) => {
    setUnVerifiedObj(e);
  };
  return { unVerifiedObj, setUnVerifiedObjChange, setIsDisable, WithdrawnFooter };
};

export default useWithdrawnHook;
