/**
 * 主看板 Home — 组合概览、实时价、快捷操作
 * 原型参考：docs/prototype/diviflow_interactive_1.html 中 S5（主看板 Home）
 */
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, GoldButton, SectionTitle } from '@components/ui';
import { useAuthStore, useHoldingsStore } from '@stores/index';
import { theme } from '@theme/index';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { summary, items, isLoading, error, fetchAll } = useHoldingsStore();

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const displayTotal = summary
    ? formatMoney(summary.totalMarketValue, summary.baseCurrency)
    : '— —';

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.greet}>
          <Text style={styles.greetName}>{user?.nickname ?? '你好，投资者'}</Text>
          <Text style={styles.greetSub}>今日继续攒股收息 ·</Text>
        </View>

        <Card highlight>
          <Text style={styles.label}>组合市值</Text>
          <Text style={styles.portfolioValue}>{displayTotal}</Text>
          <Text style={styles.label}>
            {isLoading ? '加载中…' : `持仓 ${items.length} 只`}
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Card>

        <SectionTitle>快捷操作</SectionTitle>
        <View style={styles.actions}>
          <GoldButton label="+ 添加持仓" onPress={() => {}} />
          <GoldButton label="✦ AI 扫描" variant="outline" onPress={() => {}} />
        </View>

        {items.length === 0 && !isLoading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>组合为空 · 点击「+ 添加持仓」开始记录</Text>
          </View>
        ) : null}

        {isLoading ? <ActivityIndicator color={theme.colors.gold} style={styles.loader} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const formatMoney = (n: number, currency: string): string =>
  `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg0 },
  screen: { flex: 1, backgroundColor: theme.colors.bg0 },
  content: { paddingTop: theme.spacing.lg, paddingBottom: theme.spacing['3xl'] },
  greet: { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
  greetName: { ...theme.textStyles.h2, color: theme.colors.t0 },
  greetSub: { ...theme.textStyles.caption, color: theme.colors.t2, marginTop: 2 },
  label: { ...theme.textStyles.label, color: theme.colors.t2, marginBottom: 4 },
  portfolioValue: {
    ...theme.textStyles.display,
    color: theme.colors.gold2,
    marginBottom: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  empty: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.textStyles.caption,
    color: theme.colors.t3,
  },
  loader: { marginTop: theme.spacing.lg },
  errorText: {
    ...theme.textStyles.caption,
    color: theme.colors.red,
    marginTop: theme.spacing.xs,
  },
});
