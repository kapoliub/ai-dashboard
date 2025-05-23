'use client';

import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Select, useMediaQuery
} from '@mui/material';
import MenuIcon  from '@mui/icons-material/Menu';
import DarkIcon  from '@mui/icons-material/DarkMode';
import LightIcon from '@mui/icons-material/LightMode';

import { useTheme } from '@mui/material/styles';
import { useColorMode } from '@/components/providers/theme-provider';
import { useAuth }      from '@/components/providers/auth-provider';

import { useTranslations } from 'next-intl';

import { SUPPORTED_LOCALES } from '@/utils/constants';
import useLocaleChanger from 'src/hooks/use-locale-changer';

interface Props { onMenu: () => void }

export default function Navbar({ onMenu }: Props) {
  const theme  = useTheme();
  const mdUp   = useMediaQuery(theme.breakpoints.up('md'));

  const { mode, toggle } = useColorMode();
  const { user, logout } = useAuth();
  const { currentLocale, changeLocale } = useLocaleChanger();

  const tNav = useTranslations('nav');
  
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="fixed" elevation={1} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>

        {!mdUp && (
          <IconButton edge="start" color="inherit" onClick={onMenu} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {tNav('title')}
        </Typography>

        {/* Перемикач мов */}
        <Select
          variant="standard"
          value={currentLocale}
          onChange={(e) => changeLocale(e.target.value)}
          sx={{
            mr: 2,
            color: 'inherit',
            '.MuiSelect-icon': { color: 'inherit' }
          }}
        >
          {SUPPORTED_LOCALES.map((l) => (
            <MenuItem key={l} value={l}>
              {l.toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        {/* світло/темно */}
        <IconButton color="inherit" onClick={toggle}>
          {mode === 'light' ? <DarkIcon /> : <LightIcon />}
        </IconButton>

        {/* аватар + меню */}
        {user && (
          <>
            <IconButton color="inherit" onClick={(e) => setMenuEl(e.currentTarget)}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                {user.name[0]}
              </Avatar>
            </IconButton>
            <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={() => setMenuEl(null)}>
              <MenuItem disabled>{user.email}</MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuEl(null);
                  logout();
                }}
              >
                {tNav('logout')}
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
