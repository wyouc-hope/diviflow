/**
 * 发现工具页 — 原型 S13：个股档案、高息筛选、DRIP、税后计算
 */
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme/index';

export default function DiscoverScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.placeholder}>发现工具（待实现）</Text>
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
