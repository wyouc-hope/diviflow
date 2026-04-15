/**
 * 间距令牌 — 统一全局 padding/margin/gap
 * 命名参考 Tailwind：xs(4) sm(8) md(12) lg(16) xl(24) 2xl(32)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

/** 圆角令牌 */
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
