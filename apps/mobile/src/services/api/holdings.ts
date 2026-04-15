/**
 * 持仓相关端点
 */
import type { Holding, PortfolioSummary } from '@/types/holding';
import type { Paginated } from '@/types/common';
import { api } from './client';

export interface UpsertHoldingPayload {
  symbol: string;
  shares: number;
  avgCost: number;
  firstBuyAt?: string;
  note?: string;
}

export const holdingsApi = {
  list: (query?: { page?: number; pageSize?: number }) =>
    api.get<Paginated<Holding>>('/holdings', { query }),

  summary: () => api.get<PortfolioSummary>('/holdings/summary'),

  get: (id: string) => api.get<Holding>(`/holdings/${id}`),

  create: (payload: UpsertHoldingPayload) => api.post<Holding>('/holdings', payload),

  update: (id: string, payload: UpsertHoldingPayload) =>
    api.put<Holding>(`/holdings/${id}`, payload),

  remove: (id: string) => api.delete<{ ok: true }>(`/holdings/${id}`),

  /** AI 扫描截图识别持仓（返回解析后的结构化数据，供用户确认后批量创建） */
  scanImage: (imageBase64: string) =>
    api.post<{ candidates: UpsertHoldingPayload[] }>('/holdings/scan', {
      image: imageBase64,
    }),
};
