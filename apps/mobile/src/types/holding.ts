/**
 * 持仓领域类型
 */
import type { Currency } from './common';

/** 市场枚举（原型里支持 A 股 / 港股 / 美股等） */
export type Market = 'CN_A' | 'HK' | 'US' | 'SG' | 'OTHER';

/** 股票基础信息 */
export interface Stock {
  symbol: string;
  name: string;
  market: Market;
  currency: Currency;
  /** 最新价（由行情接口刷新） */
  lastPrice?: number;
  /** 当日涨跌幅（百分比） */
  dayChangePct?: number;
  /** 股息率（年化百分比） */
  dividendYield?: number;
}

/** 一条持仓记录 */
export interface Holding {
  id: string;
  userId: string;
  stock: Stock;
  /** 持有数量（股） */
  shares: number;
  /** 成本均价（stock.currency 计） */
  avgCost: number;
  /** 买入日期（ISO） */
  firstBuyAt?: string;
  /** 备注 */
  note?: string;
  createdAt: string;
  updatedAt: string;
}

/** 持仓组合概览 */
export interface PortfolioSummary {
  baseCurrency: Currency;
  /** 总市值（折算到 baseCurrency） */
  totalMarketValue: number;
  /** 总成本 */
  totalCost: number;
  /** 浮动盈亏 */
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  /** 年化预期分红 */
  annualDividendEstimate: number;
}
