/**
 * 分红日历页 — 原型 S9
 * TODO: 接入日历组件、事件标记、派息提醒
 */
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme/index';

export default function CalendarScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.placeholder}>分红日历（待实现）</Text>
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
