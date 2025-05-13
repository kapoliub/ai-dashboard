import { Box, Paper, Typography } from '@mui/material';

interface Props {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user';
  return (
    <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'} my={1}>
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="body2">{content}</Typography>
      </Paper>
    </Box>
  );
}
