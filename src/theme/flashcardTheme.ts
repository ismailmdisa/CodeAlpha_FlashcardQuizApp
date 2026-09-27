export const THEME = {
  colors: {
    // Primary brand accents
    primary: '#4F46E5', // Indigo-600
    primaryLight: '#EEF2FF', // Indigo-50
    primaryHover: '#4338CA',
    primaryBorder: '#C7D2FE',

    // Secondary / Answer Accent
    secondary: '#0D9488', // Teal-600
    secondaryLight: '#F0FDFA',
    secondaryBorder: '#99F6E4',

    // Neutrals & Surfaces
    background: '#F8FAFC', // Slate-50
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9', // Slate-100
    border: '#E2E8F0', // Slate-200
    borderFocus: '#94A3B8',

    // Text & Hierarchy
    textPrimary: '#0F172A', // Slate-900
    textSecondary: '#475569', // Slate-600
    textMuted: '#94A3B8', // Slate-400
    textInverse: '#FFFFFF',

    // Status & Feedback
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    danger: '#EF4444',
    dangerLight: '#FEF2F2',

    // Card Specific
    questionCardBg: '#FFFFFF',
    answerCardBg: '#F8FAFC',
    cardShadow: 'rgba(15, 23, 42, 0.08)',
  },

  typography: {
    fontFamily: {
      sans: 'System',
    },
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
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

  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    button: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2,
    },
  },
};
