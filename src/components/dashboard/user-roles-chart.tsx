'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import { getUserRoles, UserRoles as UserRolesType } from '@/utils/mock-dashboard';
import { useEffect, useState } from 'react';
import SkeletonChart from './skeleton-chart';

const COLORS = ['#2196f3', '#4caf50', '#ff9800'];

export default function UserRolesChart() {
  const [data, setData] = useState<UserRolesType | null>(null);

  useEffect(() => {
    getUserRoles().then(setData);
  }, []);

  if (!data) return <SkeletonChart title="User Roles" />;

  return (
      <Card sx={{ height: 300 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
            User Roles
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                data={data.users}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
                >
                {data.users.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
  );
}
