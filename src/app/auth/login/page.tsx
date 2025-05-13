// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await login(email, pass);
    setLoading(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Sign in</Typography>

      <Stack spacing={2}>
        <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth value={pass} onChange={e => setPass(e.target.value)} />
        <Button variant="contained" disabled={loading || !email || !pass} onClick={handleSubmit}>
          {loading ? 'Loading…' : 'Login'}
        </Button>
      </Stack>
    </>
  );
}
