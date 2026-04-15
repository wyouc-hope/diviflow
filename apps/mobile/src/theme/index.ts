/**
 * 主题令牌统一出口
 * 使用示例：
 *   import { theme } from '@theme/index';
 *   <View style={{ padding: theme.spacing.lg, backgroundColor: theme.colors.bg1 }} />
 */
export { colors } from './colors';
export { spacing, radius } from './spacing';
export { fontSize, fontWeight, textStyles } from './typography';

import { colors } from './colors';
import { spacing, radius } from './spacing';
import { fontSize, fontWeight, textStyles } from './typography';

export const theme = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  textStyles,
} as const;

export type Theme = typeof theme;
