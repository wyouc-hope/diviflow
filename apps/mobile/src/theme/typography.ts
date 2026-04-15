/**
 * 字体令牌 — 参考原型 diviflow_interactive_1.html 中的字号层级
 */
import type { TextStyle } from 'react-native';

export const fontSize = {
  xs: 9,
  sm: 10,
  base: 12,
  md: 13,
  lg: 14,
  xl: 16,
  '2xl': 18,
  '3xl': 22,
  '4xl': 28,
  '5xl': 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

/** 常用文本样式预设 */
export const textStyles = {
  /** 大标题（Home 组合总额） */
  display: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
  /** 屏幕标题 */
  h1: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.3,
  },
  /** 卡片标题 */
  h2: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  /** 正文 */
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
  },
  /** 次要说明 */
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  /** 标签/徽章 */
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
} satisfies Record<string, TextStyle>;

export type TextStyleKey = keyof typeof textStyles;
