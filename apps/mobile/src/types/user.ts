/**
 * 用户领域类型
 */
import type { Currency, Region } from './common';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  nickname: string;
  avatarUrl?: string;
  region: Region;
  baseCurrency: Currency;
  /** 月支出目标（以 baseCurrency 计） */
  monthlyExpenseTarget: number;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginPayload {
  phone: string;
  code: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
