// 模拟数据

export interface Stock {
  id: string;
  name: string;
  code: string;
  shares: number;
  price: number;
  dividendYield: number;
  color: string;
  shortName: string;
}

export interface Dividend {
  id: string;
  stockId: string;
  stockName: string;
  stockCode: string;
  shortName: string;
  color: string;
  perShare: number;
  amount: number;
  date: string;
  status: 'confirmed' | 'pending';
  recordDate: string;
  exDate: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'next' | 'locked';
  date?: string;
  progress?: number;
}

export interface CalendarEvent {
  date: number;
  dividends: Dividend[];
}

// 用户数据
export const userData = {
  name: 'Ying',
  uid: '10248621',
  memberType: '年度会员',
  memberExpiry: '2027年3月30日',
  joinDays: 287,
  totalDividends: 21460,
  stockCount: 6,
};

// 持仓数据
export const stocks: Stock[] = [
  {
    id: '1',
    name: '工商银行',
    code: '601398',
    shares: 2895,
    price: 5.46,
    dividendYield: 5.45,
    color: '#000',
    shortName: '工行',
  },
  {
    id: '2',
    name: '建设银行',
    code: '601939',
    shares: 3190,
    price: 8.12,
    dividendYield: 4.79,
    color: '#1a1a2e',
    shortName: '建行',
  },
  {
    id: '3',
    name: '长江电力',
    code: '600900',
    shares: 500,
    price: 27.4,
    dividendYield: 3.28,
    color: '#1a3d2e',
    shortName: '长电',
  },
  {
    id: '4',
    name: '中国神华',
    code: '601088',
    shares: 600,
    price: 38.22,
    dividendYield: 7.12,
    color: '#2d1a00',
    shortName: '神华',
  },
  {
    id: '5',
    name: '贵州茅台',
    code: '600519',
    shares: 10,
    price: 1580,
    dividendYield: 2.3,
    color: '#1a0a2e',
    shortName: '茅台',
  },
  {
    id: '6',
    name: '中国移动',
    code: '600941',
    shares: 800,
    price: 88.6,
    dividendYield: 6.1,
    color: '#0a2d1a',
    shortName: '移动',
  },
];

// 本月分红数据
export const upcomingDividends: Dividend[] = [
  {
    id: 'd1',
    stockId: '1',
    stockName: '工商银行',
    stockCode: '601398.SH',
    shortName: '工行',
    color: '#000',
    perShare: 0.2977,
    amount: 862,
    date: '2026-04-03',
    status: 'confirmed',
    recordDate: '2026-04-01',
    exDate: '2026-04-02',
  },
  {
    id: 'd2',
    stockId: '2',
    stockName: '建设银行',
    stockCode: '601939.SH',
    shortName: '建行',
    color: '#1a1a2e',
    perShare: 0.389,
    amount: 1240,
    date: '2026-04-12',
    status: 'pending',
    recordDate: '2026-04-10',
    exDate: '2026-04-11',
  },
  {
    id: 'd3',
    stockId: '3',
    stockName: '长江电力',
    stockCode: '600900.SH',
    shortName: '长电',
    color: '#1a3d2e',
    perShare: 0.9,
    amount: 450,
    date: '2026-04-18',
    status: 'pending',
    recordDate: '2026-04-16',
    exDate: '2026-04-17',
  },
];

// 里程碑数据
export const milestones: Milestone[] = [
  {
    id: 'm1',
    title: '第一笔分红到账',
    description: '2025年6月18日 · 工商银行 +234元',
    status: 'done',
    date: '2025-06-18',
  },
  {
    id: 'm2',
    title: '月收息破千',
    description: '2025年9月达成',
    status: 'done',
    date: '2025-09',
  },
  {
    id: 'm3',
    title: '目标达成 50%',
    description: '2026年2月达成 · 月收息 2,500元',
    status: 'done',
    date: '2026-02',
  },
  {
    id: 'm4',
    title: '目标达成 75%',
    description: '月收息达到 3,750 元，还差 650 元',
    status: 'next',
    progress: 83,
  },
  {
    id: 'm5',
    title: '目标全部达成',
    description: '月均股息 ≥ 5,000元 · 预计 2027年8月',
    status: 'locked',
  },
];

// 目标数据
export const goalData = {
  currentMonthly: 3100,
  targetMonthly: 5000,
  annualDividend: 37200,
  yieldRate: 5.96,
  receivedThisYear: 8920,
  yearTarget: 37200,
  estimatedDate: '2027年8月',
  monthsRemaining: 17,
};

// 日历事件数据（2026年4月）
export const calendarEvents: CalendarEvent[] = [
  { date: 3, dividends: [upcomingDividends[0]] },
  { date: 12, dividends: [upcomingDividends[1]] },
  { date: 18, dividends: [upcomingDividends[2]] },
];

// 生成sparkline SVG路径
export function generateSparkline(seed: number = 0): string {
  const points: [number, number][] = [];
  let y = 18 + (seed % 8);

  for (let x = 0; x <= 56; x += 8) {
    y = Math.max(4, Math.min(24, y + (Math.sin(x * 0.5 + seed) * 6)));
    points.push([x, y]);
  }

  return points.map((p) => `${p[0]},${p[1]}`).join(' ');
}
