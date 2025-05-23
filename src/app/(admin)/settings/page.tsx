import { Grid, Paper, Stack, Typography } from '@mui/material';
import ProfileForm from '@/components/settings/profile-form';
import PasswordForm from '@/components/settings/password-form';
import ThemeToggleCard from '@/components/settings/theme-toggle-card';
import { LanguageSwitcher } from '@/components/settings';

export default function SettingsPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>Settings</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProfileForm />
        </Grid>

        <Grid item xs={12} md={6}>
          <PasswordForm />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="space-between" alignItems="center">
              <LanguageSwitcher />
              <ThemeToggleCard />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
