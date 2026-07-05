export const colors = {
  primary: '#1E40AF',
  primaryLight: '#DBEAFE',
  primaryBorder: '#93C5FD',
  primaryDark: '#1E3A8A',
  accent: '#059669',
  accentLight: '#D1FAE5',
  surface: '#FFFFFF',
  background: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  white: '#FFFFFF',
  skeleton: '#E2E8F0',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5, color: colors.text },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 17, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 14, fontWeight: '500' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textTertiary },
  small: { fontSize: 11, fontWeight: '600' as const, color: colors.textTertiary },
  tiny: { fontSize: 10, fontWeight: '600' as const, color: colors.textTertiary },
  price: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.5, color: colors.text },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  } as const,
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  } as const,
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  } as const,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const categoryColors: Record<string, string> = {
  all: '#4F46E5',
  plastic: '#1D4ED8',
  glass: '#065F46',
  paper: '#92400E',
  electronics: '#6D28D9',
  textile: '#9D174D',
  metal: '#374151',
  organic: '#166534',
  battery: '#991B1B',
} as const;
