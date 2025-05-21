import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { getRecentActivity } from '@/utils/mock-dashboard';


export default async function RecentActivity() {
  const { activity } = await getRecentActivity();

  return (
    <Card sx={{ height: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
        Recent Activity
        </Typography>
        <List dense>
        {activity.map((item, i) => (
            <ListItem key={i}>
            <ListItemText primary={item.text} />
            </ListItem>
        ))}
        </List>
      </CardContent>
    </Card>
  );
}
