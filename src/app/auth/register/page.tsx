'use client';

import { useState } from 'react';
import {
  Typography, Stack, TextField, Button
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass }),
    });

    if (res.ok) {
      router.push('/dashboard');          // одразу авторизували
    } else {
      const { message } = await res.json();
      alert(message ?? 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>Register</Typography>

      <Stack spacing={2}>
        <TextField label="Name"  fullWidth value={name}  onChange={e => setName(e.target.value)} />
        <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth
          value={pass} onChange={e => setPass(e.target.value)} />

        <Button
          variant="contained"
          disabled={loading || !name || !email || !pass}
          onClick={handleSubmit}
        >
          {loading ? 'Loading…' : 'Create account'}
        </Button>

        <Button component={Link} href="/auth/login">
          Already have an account? Login
        </Button>
      </Stack>
    </>
  );
}
