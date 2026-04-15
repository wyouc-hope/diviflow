/**
 * 分红领域类型
 */
import type { Currency } from './common';

/** 分红事件生命周期的关键日期 */
export type DividendStage =
  | 'announced' /** 已公告 */
  | 'record' /** 登记日 */
  | 'ex' /** 除权除息日 */
  | 'pay' /** 派息日 */
  | 'paid'; /** 已到账 */

/** 一条分红事件（日历 + 通知的源数据） */
export interface DividendEvent {
  id: string;
  /** 关联股票代码 */
  symbol: string;
  /** 关联持仓 id（可选：仅针对已持有的） */
  holdingId?: string;
  /** 每股派息（原币种） */
  perShare: number;
  currency: Currency;
  stage: DividendStage;
  /** 登记日（ISO 日期） */
  recordDate?: string;
  /** 除权除息日 */
  exDividendDate?: string;
  /** 派息日 */
  payDate?: string;
}

/** 财务自由进度 */
export interface FinancialIndependenceProgress {
  /** 月度预计分红收入（基础货币，已扣税） */
  monthlyDividendEstimate: number;
  /** 月支出目标 */
  monthlyExpenseTarget: number;
  /** 覆盖率 0 ~ 1 */
  coverageRatio: number;
  /** 下一个里程碑（如 50% / 100%）文案 */
  nextMilestone?: string;
}
