'use client'

import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ReactNode } from 'react'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1277e1', // Zillow Blue as specified in the design
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'var(--font-sans)', // Use Next.js font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents automatic uppercase transformation
        },
      },
    },
  },
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
