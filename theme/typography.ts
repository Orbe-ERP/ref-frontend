// export const TYPOGRAPHY = {
//   regular: "normal",
//   medium: "normal",
//   bold: "normal",
//   heavy: "normal",
// } as const;

// export type AppThemeFonts = typeof TYPOGRAPHY;

// typography.ts
export const TYPOGRAPHY = {
  family: {
    regular: "System",
    medium: "System", 
    bold: "System",
    heavy: "System",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  }
} as const;

export type AppThemeFonts = typeof TYPOGRAPHY;