/**
 * 持仓列表页 — 原型 S7
 * TODO: 接入分页、下拉刷新、滑动编辑
 */
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme/index';

export default function HoldingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.placeholder}>持仓列表（待实现）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: { ...theme.textStyles.body, color: theme.colors.t2 },
});
