'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import { User } from '@/utils/mock-users';

interface Props {
  open: boolean;
  initial?: User | null;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
}

export default function UserFormDialog({ open, initial, onClose, onSave }: Props) {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [role,  setRole]  = useState<User['role']>('Viewer');

  // якщо редагуємо, заповнюємо поля
  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setEmail(initial.email);
      setRole(initial.role);
    } else {
      setName('');
      setEmail('');
      setRole('Viewer');
    }
  }, [initial]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit user' : 'Add user'}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth label="Name" value={name}
          onChange={e => setName(e.target.value)} sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="Email" value={email}
          onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }}
        />
        <TextField
          select fullWidth label="Role" value={role}
          onChange={e => setRole(e.target.value as User['role'])}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Editor">Editor</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave({ name, email, role })}
          disabled={!name || !email}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
