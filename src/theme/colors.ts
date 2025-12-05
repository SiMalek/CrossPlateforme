/**
 * Premium Color System - Santé Connect
 * Inspired by modern healthcare and fintech applications
 */

export const colors = {
    // Core Brand Colors
    white: '#FFFFFF',
    black: '#000000',

    // Primary - Premium Medical Blue with depth
    primary: '#0066FF',
    primaryLight: '#3D8BFF',
    primaryDark: '#0052CC',
    primaryExtraLight: '#E6F0FF',
    primaryMuted: '#99C2FF',

    // Secondary - Elegant Indigo/Violet
    secondary: '#6366F1',
    secondaryLight: '#818CF8',
    secondaryDark: '#4F46E5',
    secondaryExtraLight: '#EEF2FF',

    // Accent - Modern Teal/Cyan
    accent: '#06B6D4',
    accentLight: '#22D3EE',
    accentDark: '#0891B2',

    // Premium Gradients - Inspired by top-tier apps
    gradientPrimary: ['#0066FF', '#6366F1'] as const,
    gradientPrimaryDark: ['#0052CC', '#4F46E5'] as const,
    gradientSecondary: ['#6366F1', '#A855F7'] as const,
    gradientAccent: ['#06B6D4', '#0066FF'] as const,
    gradientWarm: ['#F97316', '#EC4899'] as const,
    gradientSuccess: ['#10B981', '#06B6D4'] as const,
    gradientSurface: ['#FFFFFF', '#F8FAFC'] as const,
    gradientCard: ['#FFFFFF', '#FAFBFF'] as const,
    gradientDark: ['#1E293B', '#0F172A'] as const,
    gradientGlass: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'] as const,
    gradientOverlay: ['rgba(0, 102, 255, 0.08)', 'rgba(99, 102, 241, 0.05)'] as const,

    // Backgrounds - Clean & Modern
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    backgroundTertiary: '#E2E8F0',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFBFF',
    surfaceHover: '#F8FAFC',
    surfacePressed: '#F1F5F9',

    // Text - Refined hierarchy
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textInverted: '#FFFFFF',
    textMuted: '#CBD5E1',
    textLink: '#0066FF',

    // Status Colors - Vibrant & Clear
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    successBg: '#ECFDF5',

    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    warningBg: '#FFFBEB',

    danger: '#EF4444',
    dangerLight: '#F87171',
    dangerDark: '#DC2626',
    dangerBg: '#FEF2F2',

    info: '#0066FF',
    infoLight: '#3D8BFF',
    infoDark: '#0052CC',
    infoBg: '#E6F0FF',

    // Order Status - Distinctive palette
    statusEnAttente: '#F59E0B',
    statusEnAttenteLight: '#FEF3C7',
    statusEnPreparation: '#0066FF',
    statusEnPreparationLight: '#DBEAFE',
    statusPrete: '#10B981',
    statusPreteLight: '#D1FAE5',
    statusRecuperee: '#6366F1',
    statusRecupereeLight: '#E0E7FF',
    statusRetournee: '#EF4444',
    statusRetourneeLight: '#FEE2E2',

    // UI Elements - Subtle & Professional
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderFocus: '#0066FF',
    divider: '#F1F5F9',
    overlay: 'rgba(15, 23, 42, 0.5)',
    overlayLight: 'rgba(15, 23, 42, 0.25)',
    backdrop: 'rgba(0, 0, 0, 0.4)',

    // Interactive states
    ripple: 'rgba(0, 102, 255, 0.08)',
    highlight: 'rgba(0, 102, 255, 0.04)',

    // Glassmorphism - Premium feel
    glass: {
        background: 'rgba(255, 255, 255, 0.85)',
        backgroundStrong: 'rgba(255, 255, 255, 0.95)',
        backgroundSubtle: 'rgba(255, 255, 255, 0.6)',
        border: 'rgba(255, 255, 255, 0.5)',
        borderStrong: 'rgba(255, 255, 255, 0.8)',
    },

    // Shadows - Depth & Dimension
    shadows: {
        xs: {
            shadowColor: '#64748B',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 2,
            elevation: 1,
        },
        sm: {
            shadowColor: '#64748B',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#475569',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
        },
        lg: {
            shadowColor: '#334155',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8,
        },
        xl: {
            shadowColor: '#1E293B',
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.12,
            shadowRadius: 32,
            elevation: 12,
        },
        primary: {
            shadowColor: '#0066FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
        },
        soft: {
            shadowColor: '#94A3B8',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
    }
};

export const layout = {
    borderRadius: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        '2xl': 24,
        '3xl': 32,
        full: 9999,
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        base: 16,
        lg: 20,
        xl: 24,
        '2xl': 32,
        '3xl': 40,
        '4xl': 48,
        '5xl': 64,
        '6xl': 80,
    },
};

// Export gradients separately for easier access in components
export const gradients = {
    primary: colors.gradientPrimary,
    primaryDark: colors.gradientPrimaryDark,
    secondary: colors.gradientSecondary,
    accent: colors.gradientAccent,
    warm: colors.gradientWarm,
    success: colors.gradientSuccess,
    surface: colors.gradientSurface,
    card: colors.gradientCard,
    dark: colors.gradientDark,
    glass: colors.gradientGlass,
    overlay: colors.gradientOverlay,
};
