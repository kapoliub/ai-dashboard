'use client';

import { useState } from 'react';
import {
  Typography, Stack, TextField, Button, Alert
} from '@mui/material';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else alert('Error sending reset link');
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>

      {done ? (
        <Alert severity="success">
          Check your inbox — we’ve sent a reset link to {email}.
        </Alert>
      ) : (
        <Stack spacing={2}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !email}
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>

          <Button component={Link} href="/auth/login">
            Back to login
          </Button>
        </Stack>
      )}
    </>
  );
}
