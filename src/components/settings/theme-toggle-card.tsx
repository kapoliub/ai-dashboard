'use client';

import { Typography, Switch, Stack } from '@mui/material';
import { useColorMode } from '@/components/providers/theme-provider';

export default function ThemeToggleCard() {
  const { mode, toggle } = useColorMode();

  return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6">Dark theme</Typography>
        <Switch checked={mode === 'dark'} onChange={toggle} />
      </Stack>
  );
}
