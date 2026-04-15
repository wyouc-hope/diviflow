/**
 * 通用类型
 */

/** 支持的地区（决定税率、汇率、数据源） */
export type Region = 'CN' | 'US' | 'HK' | 'SG';

/** 支持的货币 */
export type Currency = 'CNY' | 'USD' | 'HKD' | 'SGD';

/** 地区与货币的默认映射 */
export const REGION_CURRENCY: Record<Region, Currency> = {
  CN: 'CNY',
  US: 'USD',
  HK: 'HKD',
  SG: 'SGD',
};

/** 统一的涨跌方向 */
export type ChangeDirection = 'up' | 'down' | 'flat';

/** 分页响应包装 */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
