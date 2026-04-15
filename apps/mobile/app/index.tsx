/**
 * 根路由 — 依据登录态做重定向
 */
import { Redirect } from 'expo-router';
import { useAuthStore } from '@stores/index';

export default function Index() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  return isAuthed ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}
