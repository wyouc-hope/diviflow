/**
 * Expo Router 根布局
 * - 注册全局状态 / 主题 / 状态栏
 * - 根据登录态决定初始路由（实际上 Expo Router 由 index.tsx 做重定向）
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@theme/index';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg0 },
          headerTintColor: theme.colors.t0,
          contentStyle: { backgroundColor: theme.colors.bg0 },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
