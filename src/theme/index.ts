import { colors, layout, gradients } from './colors';

export { colors, gradients };

export const spacing = layout.spacing;
export const borderRadius = layout.borderRadius;

export const shadows = colors.shadows;

export const typography = {
    fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
    },
};

export const theme = {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
    gradients,
};
