/**
 * 登录页 — 手机号 + 验证码 / 微信 / 苹果
 * 原型参考：S2 登录
 */
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { GoldButton } from '@components/ui';
import { authApi } from '@services/api';
import { useAuthStore } from '@stores/index';
import { theme } from '@theme/index';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  const onLogin = async () => {
    if (!phone || !code) {
      Alert.alert('请填写手机号和验证码');
      return;
    }
    setLoading(true);
    try {
      const { user, tokens } = await authApi.loginByPhone({ phone, code });
      setSession(user, tokens);
      router.replace('/(tabs)');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败';
      Alert.alert('登录失败', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>DiviFlow 息流</Text>
      <Text style={styles.sub}>分红投资者工具</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="手机号"
          placeholderTextColor={theme.colors.t3}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="验证码"
          placeholderTextColor={theme.colors.t3}
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        <GoldButton label={loading ? '登录中…' : '登录'} onPress={onLogin} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg0,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 80,
  },
  logo: { ...theme.textStyles.h1, color: theme.colors.gold2, textAlign: 'center' },
  sub: {
    ...theme.textStyles.caption,
    color: theme.colors.t2,
    textAlign: 'center',
    marginTop: 6,
  },
  form: { marginTop: theme.spacing['2xl'], gap: theme.spacing.md },
  input: {
    backgroundColor: theme.colors.bg2,
    borderColor: theme.colors.bd2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.radius.lg,
    color: theme.colors.t0,
    fontSize: theme.fontSize.base,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
});
