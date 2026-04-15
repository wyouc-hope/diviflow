/**
 * 认证相关端点
 */
import type { LoginPayload, LoginResponse } from '@/types/user';
import { api } from './client';

export const authApi = {
  /** 发送短信验证码 */
  sendSmsCode: (phone: string) =>
    api.post<{ ok: true }>('/auth/sms-code', { phone }, { authed: false }),

  /** 手机号 + 验证码登录 */
  loginByPhone: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload, { authed: false }),

  /** 刷新 Token */
  refresh: (refreshToken: string) =>
    api.post<LoginResponse>('/auth/refresh', { refreshToken }, { authed: false }),

  /** 登出 */
  logout: () => api.post<{ ok: true }>('/auth/logout'),
};
