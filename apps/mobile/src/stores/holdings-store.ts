/**
 * 持仓列表 + 组合概览的状态存储
 */
import { create } from 'zustand';
import type { Holding, PortfolioSummary } from '@/types/holding';
import { holdingsApi } from '@/services/api';

interface HoldingsState {
  items: Holding[];
  summary: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  upsert: (holding: Holding) => void;
  remove: (id: string) => void;
}

export const useHoldingsStore = create<HoldingsState>((set, get) => ({
  items: [],
  summary: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [list, summary] = await Promise.all([
        holdingsApi.list({ page: 1, pageSize: 200 }),
        holdingsApi.summary(),
      ]);
      set({ items: list.items, summary, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载持仓失败';
      set({ isLoading: false, error: message });
    }
  },

  upsert: (holding) => {
    const { items } = get();
    const idx = items.findIndex((h) => h.id === holding.id);
    if (idx >= 0) {
      const next = items.slice();
      next[idx] = holding;
      set({ items: next });
    } else {
      set({ items: [...items, holding] });
    }
  },

  remove: (id) => set({ items: get().items.filter((h) => h.id !== id) }),
}));
