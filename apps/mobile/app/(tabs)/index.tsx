/**
 * 主看板 Home — 组合概览、实时价、快捷操作
 * 原型参考：docs/prototype/diviflow_interactive_1.html 中 S5 (screen-title = "主看板 Home")
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, GoldButton, SectionTitle } from '@components/ui';
import { useHoldingsStore } from '@stores/index';
import { theme } from '@theme/index';
import { useEffect } from 'react';

export default function HomeScreen() {
  const { summary, items, fetchAll } = useHoldingsStore();

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.greet}>
        <Text style={styles.greetName}>你好，投资者</Text>
        <Text style={styles.greetSub}>今日继续攒股收息 ·</Text>
      </View>

      <Card highlight>
        <Text style={styles.label}>组合市值</Text>
        <Text style={styles.portfolioValue}>
          {summary ? formatMoney(summary.totalMarketValue, summary.baseCurrency) : '— —'}
        </Text>
        <Text style={styles.label}>持仓 {items.length} 只</Text>
      </Card>

      <SectionTitle>快捷操作</SectionTitle>
      <View style={styles.actions}>
        <GoldButton label="+ 添加持仓" onPress={() => {}} />
        <GoldButton label="✦ AI 扫描" variant="outline" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}

const formatMoney = (n: number, currency: string): string =>
  `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const styles = StyleSheet.create({
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
});
