
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
} from '@mui/material';
import * as React from 'react';
import { useEffect, useRef } from 'react';

interface IDialog extends DialogProps {
  footer: React.ReactNode;
  open: boolean;
}

const Dialog = ({ open,footer, children, ...props }: IDialog) => {

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <MuiDialog
        {...props}
        open={open}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1} sx={{color:"#1A1A1A"}}>
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>{footer}</DialogActions>
      </MuiDialog>
    </>
  );
};

export default Dialog;
