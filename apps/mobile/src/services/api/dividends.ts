/**
 * 分红相关端点
 */
import type { DividendEvent, FinancialIndependenceProgress } from '@/types/dividend';
import { api } from './client';

export const dividendsApi = {
  /** 获取分红日历（指定月份） */
  calendar: (query: { year: number; month: number }) =>
    api.get<DividendEvent[]>('/dividends/calendar', { query }),

  /** 财务自由覆盖率 */
  fiProgress: () => api.get<FinancialIndependenceProgress>('/dividends/fi-progress'),
};
