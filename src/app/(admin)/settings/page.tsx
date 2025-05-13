import { Grid, Typography } from '@mui/material';
import ProfileForm from '@/components/settings/profile-form';
import PasswordForm from '@/components/settings/password-form';
import ThemeToggleCard from '@/components/settings/theme-toggle-card';

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
          <ThemeToggleCard />
        </Grid>
      </Grid>
    </>
  );
}
