'use client';

import { useEffect, useState } from 'react';
import { Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import Widget from '@/components/ui/widget';
import { getDashboardMetrics, Metrics } from '@/utils/mock-dashboard';

export default function DashboardPage() {
  const [data, setData] = useState<Metrics | null>(null);

  useEffect(() => {
    getDashboardMetrics().then(setData);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4}>
          {data ? <Widget title="Users" value={data.users} />
                : <Skeleton variant="rounded" height={100} />}
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          {data ? <Widget title="Sales" value={data.sales} />
                : <Skeleton variant="rounded" height={100} />}
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          {data ? <Widget title="Activity" value={`${data.activity}%`} />
                : <Skeleton variant="rounded" height={100} />}
        </Grid>
      </Grid>
    </>
  );
}
