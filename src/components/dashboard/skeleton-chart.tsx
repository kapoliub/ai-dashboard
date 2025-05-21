import { Card, CardContent, Skeleton, Typography } from '@mui/material';

export default function SkeletonChart({ title }: { title: string }) {
  return (
    <Card id="skeleton-chart" sx={{ height: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </CardContent>
    </Card>
  );
}
