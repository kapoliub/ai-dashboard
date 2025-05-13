'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

type Mode = 'light' | 'dark';
interface Context { mode: Mode; toggle: () => void }

const ColorModeContext = createContext<Context | undefined>(undefined);
export const useColorMode = () => useContext(ColorModeContext)!;

function getStoredMode(): Mode {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('mode') as Mode) || 'light';
}

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');

  // init from localStorage
  useEffect(() => setMode(getStoredMode()), []);

  const value = useMemo<Context>(
    () => ({
      mode,
      toggle: () => {
        setMode(prev => {
          const next = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', next);
          return next;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
          MuiPaper: { styleOverrides:{ root:{ ...(mode==='dark' && { backgroundImage:'none' }) } } },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
