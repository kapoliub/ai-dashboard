'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

import { getMonthlySales, MonthlySales } from '@/utils/mock-dashboard';
import { useEffect } from 'react';
import { useState } from 'react';
import SkeletonChart from './skeleton-chart';

export default function MonthlySalesChart() {
  const [data, setData] = useState<MonthlySales | null>(null);

  useEffect(() => {
    getMonthlySales().then(setData);
  }, []);

  if (!data) return <SkeletonChart title="Monthly Sales" />;

  return (
      <Card sx={{ height: 300 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Sales
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
