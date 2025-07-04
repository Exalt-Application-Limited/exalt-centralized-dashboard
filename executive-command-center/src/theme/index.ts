import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      socialCommerce: string;
      warehousing: string;
      courier: string;
      haulage: string;
      infrastructure: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }

  interface ThemeOptions {
    customColors?: {
      socialCommerce?: string;
      warehousing?: string;
      courier?: string;
      haulage?: string;
      infrastructure?: string;
      success?: string;
      warning?: string;
      error?: string;
      info?: string;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0', // Executive blue
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#D32F2F', // Executive red
      light: '#FF5252',
      dark: '#B71C1C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  customColors: {
    socialCommerce: '#4CAF50', // Green
    warehousing: '#FF9800',    // Orange
    courier: '#2196F3',        // Blue
    haulage: '#9C27B0',        // Purple
    infrastructure: '#607D8B', // Blue Grey
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1565C0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E0E0E0',
          backgroundColor: '#FAFAFA',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        },
        elevation4: {
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

export const theme = createTheme(themeOptions);