import { Container } from '@mui/material';

export const metadata = { title: 'Auth | Admin Dashboard' };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      {children}
    </Container>
  );
}
