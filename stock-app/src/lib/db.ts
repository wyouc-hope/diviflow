// 数据库查询层 - 封装所有数据库操作
import { prisma } from './prisma';

// 默认用户 ID（MVP 阶段单用户）
const DEFAULT_USER_ID = 'user-default';

// 获取用户信息
export async function getUser() {
  return prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
  });
}

// 获取所有持仓
export async function getStocks() {
  return prisma.stock.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { createdAt: 'asc' },
  });
}

// 获取单个持仓
export async function getStock(id: string) {
  return prisma.stock.findUnique({
    where: { id },
    include: { dividends: { orderBy: { date: 'desc' } } },
  });
}

// 创建持仓
export async function createStock(data: {
  name: string;
  code: string;
  shares: number;
  costPrice?: number;
  currentPrice?: number;
  dividendYield?: number;
  color?: string;
  shortName: string;
}) {
  return prisma.stock.create({
    data: {
      ...data,
      userId: DEFAULT_USER_ID,
      color: data.color ?? '#000000',
    },
  });
}

// 更新持仓
export async function updateStock(id: string, data: {
  shares?: number;
  costPrice?: number;
  currentPrice?: number;
  dividendYield?: number;
}) {
  return prisma.stock.update({
    where: { id },
    data,
  });
}

// 删除持仓
export async function deleteStock(id: string) {
  // 先删除关联的分红记录
  await prisma.dividend.deleteMany({ where: { stockId: id } });
  return prisma.stock.delete({ where: { id } });
}

// 批量创建持仓（CSV 导入）
export async function importStocks(stocks: Array<{
  name: string;
  code: string;
  shares: number;
  costPrice?: number;
  shortName: string;
  color?: string;
}>) {
  const results = [];
  for (const stock of stocks) {
    const existing = await prisma.stock.findUnique({
      where: { userId_code: { userId: DEFAULT_USER_ID, code: stock.code } },
    });
    if (existing) {
      // 更新已有持仓的数量
      const updated = await prisma.stock.update({
        where: { id: existing.id },
        data: { shares: stock.shares, costPrice: stock.costPrice },
      });
      results.push(updated);
    } else {
      const created = await prisma.stock.create({
        data: { ...stock, userId: DEFAULT_USER_ID, color: stock.color ?? '#000000' },
      });
      results.push(created);
    }
  }
  return results;
}

// 获取分红记录
export async function getDividends(filters?: {
  year?: number;
  status?: string;
  stockId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return prisma.dividend.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      ...(filters?.year && { year: filters.year }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.stockId && { stockId: filters.stockId }),
      ...(filters?.startDate && filters?.endDate && {
        date: { gte: filters.startDate, lte: filters.endDate },
      }),
    },
    include: { stock: true },
    orderBy: { date: 'asc' },
  });
}

// 获取指定月份的分红
export async function getMonthDividends(year: number, month: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);
  return getDividends({ startDate, endDate });
}

// 获取活跃目标
export async function getActiveGoal() {
  return prisma.goal.findFirst({
    where: { userId: DEFAULT_USER_ID, isActive: true },
  });
}

// 设置/更新目标
export async function setGoal(targetMonthly: number) {
  // 先停用所有现有目标
  await prisma.goal.updateMany({
    where: { userId: DEFAULT_USER_ID, isActive: true },
    data: { isActive: false },
  });
  return prisma.goal.create({
    data: {
      userId: DEFAULT_USER_ID,
      targetMonthly,
      isActive: true,
    },
  });
}

// 获取里程碑
export async function getMilestones() {
  return prisma.milestone.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { id: 'asc' },
  });
}

// 计算收息统计数据
export async function getDividendStats() {
  const currentYear = new Date().getFullYear();

  // 获取所有已到账分红
  const allReceived = await prisma.dividend.findMany({
    where: { userId: DEFAULT_USER_ID, status: 'received' },
  });

  // 今年已到账
  const thisYearReceived = allReceived
    .filter(d => d.year === currentYear)
    .reduce((sum, d) => sum + d.amount, 0);

  // 累计收息
  const totalReceived = allReceived.reduce((sum, d) => sum + d.amount, 0);

  // 年化收息（基于持仓和股息率计算）
  const stocks = await getStocks();
  const annualDividend = stocks.reduce((sum, s) => {
    const yieldAmount = (s.currentPrice ?? 0) * s.shares * (s.dividendYield ?? 0) / 100;
    return sum + yieldAmount;
  }, 0);

  // 综合股息率
  const totalValue = stocks.reduce((sum, s) => sum + (s.currentPrice ?? 0) * s.shares, 0);
  const yieldRate = totalValue > 0 ? (annualDividend / totalValue) * 100 : 0;

  // 月均收息
  const currentMonthly = Math.round(annualDividend / 12);

  return {
    annualDividend: Math.round(annualDividend),
    currentMonthly,
    yieldRate: Math.round(yieldRate * 100) / 100,
    receivedThisYear: Math.round(thisYearReceived),
    totalReceived: Math.round(totalReceived),
    yearTarget: Math.round(annualDividend),
    stockCount: stocks.length,
  };
}

// 获取首页所需的聚合数据
export async function getHomeData() {
  const user = await getUser();
  const stocks = await getStocks();
  const goal = await getActiveGoal();
  const stats = await getDividendStats();

  // 获取即将到账的分红（未来的 pending 和 confirmed）
  const upcomingDividends = await prisma.dividend.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      status: { in: ['pending', 'confirmed'] },
      date: { gte: new Date() },
    },
    include: { stock: true },
    orderBy: { date: 'asc' },
  });

  const targetMonthly = goal?.targetMonthly ?? 5000;
  const progress = Math.round((stats.currentMonthly / targetMonthly) * 100);
  const remaining = targetMonthly - stats.currentMonthly;
  const monthsRemaining = stats.currentMonthly > 0
    ? Math.ceil(remaining / (stats.currentMonthly * 0.05)) // 假设每月增长 5%
    : 0;

  return {
    user,
    goalData: {
      currentMonthly: stats.currentMonthly,
      targetMonthly,
      annualDividend: stats.annualDividend,
      yieldRate: stats.yieldRate,
      receivedThisYear: stats.receivedThisYear,
      yearTarget: stats.yearTarget,
      estimatedDate: calculateEstimatedDate(monthsRemaining),
      monthsRemaining,
    },
    upcomingDividends: upcomingDividends.map(d => ({
      id: d.id,
      stockId: d.stockId,
      stockName: d.stock.name,
      stockCode: `${d.stock.code}.SH`,
      shortName: d.stock.shortName,
      color: d.stock.color,
      perShare: d.perShare,
      amount: d.amount,
      date: d.date.toISOString().split('T')[0],
      status: d.status,
      recordDate: d.recordDate?.toISOString().split('T')[0] ?? '',
      exDate: d.exDate?.toISOString().split('T')[0] ?? '',
    })),
    stocks,
  };
}

function calculateEstimatedDate(monthsRemaining: number): string {
  if (monthsRemaining <= 0) return '已达成';
  const target = new Date();
  target.setMonth(target.getMonth() + monthsRemaining);
  return `${target.getFullYear()}年${target.getMonth() + 1}月`;
}
