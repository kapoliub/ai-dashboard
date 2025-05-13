'use client';

import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardIcon  from '@mui/icons-material/SpaceDashboard';
import PeopleIcon     from '@mui/icons-material/People';
import ShoppingIcon   from '@mui/icons-material/ShoppingBag';
import BrainIcon      from '@mui/icons-material/Psychology';
import SettingsIcon   from '@mui/icons-material/Settings';

const drawerWidth = 240;

const nav = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Users',     path: '/users',     icon: <PeopleIcon />    },
  { label: 'Products',  path: '/products',  icon: <ShoppingIcon />  },
  { label: 'AI',        path: '/ai',        icon: <BrainIcon />     },
  { label: 'Settings',  path: '/settings',  icon: <SettingsIcon />  },
];

interface Props {
  open: boolean;        // для mobile
  onClose: () => void;  // для mobile
}

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const theme    = useTheme();
  const mdUp     = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Drawer
      variant={mdUp ? 'permanent' : 'temporary'}
      open={mdUp ? true : open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* відступ під AppBar */}
      <Toolbar />
      <List>
        {nav.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            href={item.path}
            selected={pathname === item.path}
            onClick={!mdUp ? onClose : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
