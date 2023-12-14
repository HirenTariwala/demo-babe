'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

type Props = {
  children: React.ReactNode;
};

export const theme = createTheme({
  spacing: 4,
  breakpoints: {
    values: {
      xs: 300, // phone
      sm: 600, // tablets
      md: 900, // small laptop
      lg: 1200, // desktop
      xl: 1536, // large screens
    },
  },
  components: {
    MuiAvatarGroup: {
      styleOverrides: {
        root: ({ ownerState: { max = 1 } }) => ({
          ...[...Array(max)].reduce(
            (result, curr, index) => ({
              ...result,
              [`& > .MuiAvatar-root:nth-of-type(${index + 1})`]: {
                zIndex: max - index,
              },
            }),
            {}
          ),
        }),
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          width: 300,
        },
        thumb: {
          color: '#FFD443',
          border: '2px solid #FFFFFF',
          height: '24px',
          width: '24px',
        },
        rail: {
          height: 5,
        },
        mark: {
          color: '#1070C8',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: '100px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0F0F0',
          color: '#646464',
          maxWidth: '40px',
          maxHeight: '40px',
          '&.MuiAvatar-root': {
            boxSizing: 'border-box',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          width: '600px',
          padding: '12px 16px',
          fontSize: '14px',
        },
        standardSuccess: {
          backgroundColor: 'green',
          color: 'white',
        },
        standardError: {
          backgroundColor: '#FDF1F1',
          color: '#E32D2D',
        },
        standardWarning: {
          backgroundColor: '#FEF7ED',
          color: '#DD8700',
        },
        standardInfo: {
          backgroundColor: '#ECF7FE',
          color: '#37AAF2',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 14px 0px rgba(0, 0, 0, 0.10)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 20px',
          fontSize: '16px',
          fontWeight: 700,
          borderRadius: 100,
        },
        sizeLarge: {
          width: '160px',
          height: '48px',
        },
        sizeMedium: {
          padding: '8px 20px',
          width: '160px',
          height: '40px',
        },
        sizeSmall: {
          padding: '8px 16px',
          width: '77px',
          height: '36px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1A1A1A',
          padding: '8px 12px',
          borderRadius: '8px',
        },
        arrow: {
          color: '#1A1A1A',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          '& .MuiLinearProgress-bar1Determinate': {
            backgroundColor: '#FFD443',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            border: '1px solid #CCC',
            '&.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          },
          borderRadius: '100px',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#1A1A1A',
    },
    secondary: {
      main: '#F0F0F0',
      light: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: ['"Helvetica Neue"'].join(','),
    fontSize: 16,
    // Big title
    h1: {
      fontSize: 40,
      fontWeight: 500,
      lineHeight: '52px',
    },
    // titles
    h2: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '32px',
    },
    h3: {
      fontSize: 20,
      fontWeight: 700,
      lineHeight: '28px',
    },
    h4: {
      fontSize: 18,
      fontWeight: 700,
      lineHeight: '28px',
    },
    h5: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '24px',
    },
    h6: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '24px',
    },
    //body
    body1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 400,
    },
    //buttons
    subtitle1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 700,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 400,
    },
    caption: {
      color: '#646464',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 400,
    },
  },
});

const ThemeProvider = ({ children }: Props) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
