/**
 * 通用卡片容器 — 对应原型 `.card` 样式
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '@theme/index';

interface CardProps {
  children: ReactNode;
  /** 高亮卡片（用于 Home 总额等强调场景），会用金色渐变边框 */
  highlight?: boolean;
  style?: ViewStyle;
}

export const Card = ({ children, highlight = false, style }: CardProps) => {
  return (
    <View style={[styles.base, highlight ? styles.highlight : styles.normal, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  normal: {
    backgroundColor: theme.colors.bg1,
    borderColor: theme.colors.bd2,
  },
  highlight: {
    backgroundColor: theme.colors.bg1,
    borderColor: 'rgba(200,168,75,0.2)',
  },
});
