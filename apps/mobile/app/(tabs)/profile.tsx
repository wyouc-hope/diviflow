/**
 * 我的 / 设置页 — 原型 S14
 */
import { StyleSheet, Text, View } from 'react-native';
import { GoldButton } from '@components/ui';
import { useAuthStore } from '@stores/index';
import { theme } from '@theme/index';

export default function ProfileScreen() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.screen}>
      <Text style={styles.nickname}>{user?.nickname ?? '未登录'}</Text>
      <Text style={styles.meta}>{user?.region ? `地区 · ${user.region}` : '—'}</Text>

      <View style={styles.actions}>
        <GoldButton label="退出登录" variant="outline" onPress={clearSession} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg0,
    padding: theme.spacing.xl,
  },
  nickname: { ...theme.textStyles.h2, color: theme.colors.t0 },
  meta: { ...theme.textStyles.caption, color: theme.colors.t2, marginTop: 4 },
  actions: { marginTop: theme.spacing.xl },
});
