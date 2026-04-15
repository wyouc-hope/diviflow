/**
 * 认证状态：用户 + Token
 *
 * 后续若要持久化，可接入 AsyncStorage + zustand/middleware/persist。
 */
import { create } from 'zustand';
import type { AuthTokens, User } from '@/types/user';
import { setAccessTokenProvider } from '@/services/api';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthed: boolean;
  setSession: (user: User, tokens: AuthTokens) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthed: false,
  setSession: (user, tokens) => set({ user, tokens, isAuthed: true }),
  clearSession: () => set({ user: null, tokens: null, isAuthed: false }),
}));

// 向 API 客户端注入 token 提供者，避免循环依赖
setAccessTokenProvider(() => useAuthStore.getState().tokens?.accessToken);
