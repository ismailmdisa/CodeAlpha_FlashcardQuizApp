// Pop Cartoon Quiz Design System Tokens (Stitch Design Specification)

export const THEME = {
  colors: {
    // Canvas & Surfaces
    background: '#fcfae6', // Warm Cream
    creamSurface: '#fefce8',
    surface: '#fcfae6',
    surfaceSubtle: '#f0efdb',
    surfaceVariant: '#e5e3d0',
    whitePure: '#ffffff',
    pitchBlack: '#09090b',
    inkDark: '#18181b',

    // Core Brand Clash
    primary: '#416900',
    primaryLight: '#f4fce3',
    primaryContainer: '#84cc16', // Electric Lime
    primaryBorder: '#09090b',
    neonLime: '#a3e635', // Vibrant Highlight
    secondary: '#5220e5', // Electric Purple
    secondaryLight: '#ede9fe',
    secondaryContainer: '#6b45fe',
    secondaryBorder: '#09090b',
    electricPurple: '#7c3aed',

    // Accents & Ratings
    tertiaryFixed: '#ffe083', // Sunny Yellow Pill
    tertiaryYellow: '#facc15',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    punchCoral: '#f43f5e', // Potato Brain / Error
    danger: '#f43f5e',
    dangerLight: '#ffe4e6',
    skyBlue: '#3b82f6',
    outline: '#727a64',
    outlineVariant: '#c1cab0',
    border: '#09090b',

    // Text Hierarchy
    textPrimary: '#09090b',
    textSecondary: '#424936',
    textMuted: '#727a64',
    textInverse: '#ffffff',
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    full: 9999,
    pill: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    hero: 32,
  },

  borders: {
    thin: 1.5,
    standard: 2,
    thick: 2.5,
    heavy: 3.5,
  },

  shadows: {
    card: {
      shadowColor: '#09090b',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    button: {
      shadowColor: '#09090b',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
  },

  // Neo-Brutalist Hard Extrusions
  extrusions: {
    sm: {
      borderWidth: 2,
      borderColor: '#09090b',
      shadowColor: '#09090b',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    md: {
      borderWidth: 2,
      borderColor: '#09090b',
      shadowColor: '#09090b',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    lg: {
      borderWidth: 2,
      borderColor: '#09090b',
      shadowColor: '#09090b',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    card: {
      borderWidth: 2.5,
      borderColor: '#09090b',
      shadowColor: '#09090b',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
  },

  typography: {
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
      hero: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },
};
