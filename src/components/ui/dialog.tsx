import {
    Dialog as MuiDialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
  } from '@mui/material';

export enum DialogType {
    DELETE = 'Delete',
    CONFIRM = 'Confirm',
}

interface DialogProps {
    title: string;
    content: string;
    dialogType: DialogType;
    dialogOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function Dialog({ dialogOpen, title, content, dialogType, onClose, onSubmit, }: DialogProps) {
    return (
      <MuiDialog open={dialogOpen} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} color="error" autoFocus>
            {dialogType}
          </Button>
        </DialogActions>
      </MuiDialog>
    );
}