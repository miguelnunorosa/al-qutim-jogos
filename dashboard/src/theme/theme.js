import { createTheme } from '@mui/material/styles';

/**
 * Paleta "Al-Andalus" — inspirada na descrição do projeto:
 * - Índigo profundo: cerâmica de época / céu e rio Guadiana
 * - Ouro envelhecido e cobre: artefactos metálicos e moedas
 * - Turquesa: azulejos zellige
 */
const palette = {
    indigo: {
        900: '#131B33', // fundo principal (sidebar / topbar)
        700: '#1E2B4D',
        500: '#2C4570',
        300: '#5C77A6',
    },
    gold: {
        main: '#C9973E', // ouro envelhecido
        dark: '#9C6B2A', // cobre
        light: '#E4C588',
    },
    turquoise: {
        main: '#2FB8AC',
        dark: '#1F8177',
        light: '#7FDCD2',
    },
    parchment: {
        50: '#FBF9F4', // fundo de conteúdo, tom de xisto claro / papel
        100: '#F3EFE4',
        200: '#E7E0CE',
    },
    ink: '#181C24',
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: palette.indigo[900],
            light: palette.indigo[500],
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: palette.gold.main,
            dark: palette.gold.dark,
            contrastText: palette.ink,
        },
        info: {
            main: palette.turquoise.main,
        },
        background: {
            default: palette.parchment[50],
            paper: '#FFFFFF',
        },
        text: {
            primary: palette.ink,
            secondary: '#5A6172',
        },
        divider: 'rgba(19, 27, 51, 0.08)',
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h1: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h2: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h3: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h4: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h5: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h6: { fontFamily: '"Spectral", serif', fontWeight: 600, letterSpacing: 0.2 },
        button: { textTransform: 'none', fontWeight: 600 },
        overline: { letterSpacing: 1.4, fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: palette.parchment[50],
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: `1px solid ${palette.parchment[200]}`,
                    boxShadow: '0 1px 2px rgba(19, 27, 51, 0.04)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    paddingLeft: 20,
                    paddingRight: 20,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: palette.indigo[900],
                    color: '#EFE9DA',
                    borderRight: 'none',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    marginLeft: 8,
                    marginRight: 8,
                    marginBottom: 2,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(201, 151, 62, 0.18)',
                    },
                },
            },
        },
    },
});

theme.custom = palette;

export default theme;