/**
 * 板块标题 — 对应原型 `.st` 小号灰色大写标题
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@theme/index';

interface SectionTitleProps {
  children: string;
}

export const SectionTitle = ({ children }: SectionTitleProps) => (
  <Text style={styles.title}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    ...theme.textStyles.label,
    color: theme.colors.t2,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
});
