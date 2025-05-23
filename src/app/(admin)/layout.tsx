'use client';

import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar  from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const toolbarHeight = theme.mixins.toolbar.minHeight as number; // 56|64

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Верхня панель */}
      <Navbar onMenu={() => setMobileOpen(!mobileOpen)} />

      {/* Бокове меню */}
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Основний контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: `${toolbarHeight + 24}px`,        // 24 — наш padding (=3 theme.spacing)
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: `calc(100vh - ${toolbarHeight + 24}px)`,
          overflow: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
