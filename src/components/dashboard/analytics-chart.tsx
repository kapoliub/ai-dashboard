'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import { Analytics, getAnalytics } from '@/utils/mock-dashboard';
import { useEffect, useState } from 'react';
import SkeletonChart from './skeleton-chart';

export default function AnalyticsChart() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    getAnalytics().then(setData);
  }, []);

  if (!data) return <SkeletonChart title="Monthly Users" />;

  return (
      <Card sx={{ height: 300 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
            Monthly Users
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3f51b5" strokeWidth={2} />
            </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

  );
}
