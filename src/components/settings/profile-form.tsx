'use client';

import { useState } from 'react';
import {
  Paper, Stack, TextField, Button, Typography, Alert
} from '@mui/material';

export default function ProfileForm() {
  const [name,  setName]  = useState('Demo User');
  const [email, setEmail] = useState('user@mail.com');
  const [success, setSuccess] = useState(false);

  const save = async () => {
    // replace with real API
    await new Promise(res => setTimeout(res, 500));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Profile</Typography>

      <Stack spacing={2}>
        <TextField label="Name"  value={name}  onChange={e => setName(e.target.value)} />
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />

        {success && <Alert severity="success">Saved!</Alert>}

        <Button variant="contained" onClick={save}>Save changes</Button>
      </Stack>
    </Paper>
  );
}
