'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography, Stack, TextField, Button, Alert
} from '@mui/material';

export default function ResetPasswordPage() {
const { token } = useParams() as { token: string };
const router = useRouter();
    
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (pass !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/auth/reset/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });
    setLoading(false);

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } else {
      const { message } = await res.json();
      setError(message ?? 'Reset failed');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>

      {done ? (
        <Alert severity="success">
          Password updated! Redirecting to login…
        </Alert>
      ) : (
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            type="password"
            label="New password"
            fullWidth
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <TextField
            type="password"
            label="Confirm password"
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={submit}
            disabled={loading || pass.length < 6}
          >
            {loading ? 'Saving…' : 'Update password'}
          </Button>
        </Stack>
      )}
    </>
  );
}
