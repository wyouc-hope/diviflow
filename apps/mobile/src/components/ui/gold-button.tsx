/**
 * 金色主按钮 — 对应原型 `.btn-gold`，品牌主 CTA
 */
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { theme } from '@theme/index';

interface GoldButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'solid' | 'outline';
}

export const GoldButton = ({ label, variant = 'solid', style, ...rest }: GoldButtonProps) => {
  const isSolid = variant === 'solid';
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.base,
        isSolid ? styles.solid : styles.outline,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <Text style={[styles.label, isSolid ? styles.labelSolid : styles.labelOutline]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 13,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: theme.colors.gold2,
  },
  outline: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.bd2,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.2,
  },
  labelSolid: {
    color: theme.colors.bg0,
  },
  labelOutline: {
    color: theme.colors.t2,
  },
});
