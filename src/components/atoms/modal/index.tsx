import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, useMediaQuery } from '@mui/material';
import Box from '../box';

interface ISimpleDialog extends DialogProps {
  footer: React.ReactNode;
  open: boolean;
  title: any;
  modelWidth?: string;
  isDeleteModel?: boolean;
}

const SimpleDialog = ({ title, open, footer, modelWidth, isDeleteModel, children, ...props }: ISimpleDialog) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Dialog {...props} open={open} className="deleteModal">
        <Box sx={{ padding: isMobile ? '16px' : '24px' }}>
          <DialogTitle sx={{ m: 0, p: 0 }} style={{ width: modelWidth }}>
            {title}
          </DialogTitle>
          <DialogContent sx={{ m: 0, p: 0 }}>{children}</DialogContent>
        </Box>
        <Box
          sx={
            isDeleteModel
              ? { padding: isMobile ? '16px' : '24px', boxShadow: !isMobile ? '0px 2px 14px 0px #0000001A' : '0' }
              : {}
          }
        >
          <DialogActions>{footer}</DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default SimpleDialog;
