'use client';

import { useState } from 'react';
import {
  Paper, Stack, TextField, Button, Typography, Alert
} from '@mui/material';

export default function PasswordForm() {
  const [current, setCurrent] = useState('');
  const [next,     setNext]   = useState('');
  const [confirm,  setConf]   = useState('');
  const [error,    setError]  = useState<string | null>(null);
  const [done,     setDone]   = useState(false);

  const save = async () => {
    if (next !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    // mock API
    await new Promise(res => setTimeout(res, 500));
    setDone(true);
    setCurrent(''); setNext(''); setConf('');
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Password</Typography>

      <Stack spacing={2}>
        <TextField
          label="Current password" type="password"
          value={current} onChange={e => setCurrent(e.target.value)}
        />
        <TextField
          label="New password" type="password"
          value={next} onChange={e => setNext(e.target.value)}
        />
        <TextField
          label="Confirm new password" type="password"
          value={confirm} onChange={e => setConf(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {done  && <Alert severity="success">Password updated!</Alert>}

        <Button variant="contained" onClick={save} disabled={!current || !next}>
          Update password
        </Button>
      </Stack>
    </Paper>
  );
}
