import { AnalyticsChart, MonthlySalesChart, RecentActivity, SkeletonChart, UserRolesChart } from '@/components/dashboard';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';


import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <AnalyticsChart />
        </Grid>
        <Grid xs={12} md={6}>
          <MonthlySalesChart />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <UserRolesChart />
        </Grid>
        <Grid xs={12} sm={6} md={8}>
          <Suspense fallback={<SkeletonChart title="Recent Activity" />}>
            <RecentActivity />
          </Suspense>
        </Grid>
      </Grid>
    </>
  );
}
