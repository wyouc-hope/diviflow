import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清空现有数据
  await prisma.dividend.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.user.deleteMany();

  // 创建用户
  const user = await prisma.user.create({
    data: {
      id: 'user-default',
      name: 'Ying',
      memberType: 'yearly',
      memberExpiry: new Date('2027-03-30'),
    },
  });

  // 创建持仓
  // 放大持仓量，使年化收息约 37,200 元（月均 ~3,100 元），贴合 PRD 示例
  const stocksData = [
    { id: 'stock-1', name: '工商银行', code: '601398', shares: 11600, costPrice: 4.82, currentPrice: 5.46, dividendYield: 5.45, color: '#000', shortName: '工行' },
    { id: 'stock-2', name: '建设银行', code: '601939', shares: 12800, costPrice: 6.85, currentPrice: 8.12, dividendYield: 4.79, color: '#1a1a2e', shortName: '建行' },
    { id: 'stock-3', name: '长江电力', code: '600900', shares: 2000, costPrice: 22.30, currentPrice: 27.40, dividendYield: 3.28, color: '#1a3d2e', shortName: '长电' },
    { id: 'stock-4', name: '中国神华', code: '601088', shares: 1200, costPrice: 30.50, currentPrice: 38.22, dividendYield: 7.12, color: '#2d1a00', shortName: '神华' },
    { id: 'stock-5', name: '贵州茅台', code: '600519', shares: 10, costPrice: 1420.00, currentPrice: 1580.00, dividendYield: 2.30, color: '#1a0a2e', shortName: '茅台' },
    { id: 'stock-6', name: '中国移动', code: '600941', shares: 3400, costPrice: 72.00, currentPrice: 88.60, dividendYield: 6.10, color: '#0a2d1a', shortName: '移动' },
  ];

  for (const s of stocksData) {
    await prisma.stock.create({
      data: { ...s, userId: user.id, market: 'A' },
    });
  }

  // 创建分红记录
  const dividendsData = [
    // 本月即将到账（新持仓量：工行11600股、建行12800股、长电2000股）
    { id: 'div-1', stockId: 'stock-1', perShare: 0.2977, amount: 3453, date: '2026-04-03', status: 'confirmed', recordDate: '2026-04-01', exDate: '2026-04-02', year: 2026 },
    { id: 'div-2', stockId: 'stock-2', perShare: 0.389, amount: 4979, date: '2026-04-12', status: 'pending', recordDate: '2026-04-10', exDate: '2026-04-11', year: 2026 },
    { id: 'div-3', stockId: 'stock-3', perShare: 0.9, amount: 1800, date: '2026-04-18', status: 'pending', recordDate: '2026-04-16', exDate: '2026-04-17', year: 2026 },
    // 历史已到账分红
    { id: 'div-4', stockId: 'stock-1', perShare: 0.2628, amount: 3049, date: '2025-06-18', status: 'received', recordDate: '2025-06-15', exDate: '2025-06-16', year: 2025 },
    { id: 'div-5', stockId: 'stock-4', perShare: 2.26, amount: 2712, date: '2025-07-10', status: 'received', recordDate: '2025-07-08', exDate: '2025-07-09', year: 2025 },
    { id: 'div-6', stockId: 'stock-6', perShare: 4.83, amount: 16422, date: '2025-08-20', status: 'received', recordDate: '2025-08-18', exDate: '2025-08-19', year: 2025 },
    { id: 'div-7', stockId: 'stock-2', perShare: 0.364, amount: 4659, date: '2025-09-05', status: 'received', recordDate: '2025-09-03', exDate: '2025-09-04', year: 2025 },
    { id: 'div-8', stockId: 'stock-5', perShare: 27.44, amount: 274, date: '2025-10-15', status: 'received', recordDate: '2025-10-13', exDate: '2025-10-14', year: 2025 },
    { id: 'div-9', stockId: 'stock-3', perShare: 0.82, amount: 1640, date: '2025-11-08', status: 'received', recordDate: '2025-11-06', exDate: '2025-11-07', year: 2025 },
    // 2026 年已到账
    { id: 'div-10', stockId: 'stock-4', perShare: 2.56, amount: 3072, date: '2026-01-15', status: 'received', recordDate: '2026-01-13', exDate: '2026-01-14', year: 2026 },
    { id: 'div-11', stockId: 'stock-6', perShare: 5.12, amount: 17408, date: '2026-02-20', status: 'received', recordDate: '2026-02-18', exDate: '2026-02-19', year: 2026 },
    { id: 'div-12', stockId: 'stock-1', perShare: 0.267, amount: 3097, date: '2026-03-10', status: 'received', recordDate: '2026-03-08', exDate: '2026-03-09', year: 2026 },
    { id: 'div-13', stockId: 'stock-5', perShare: 30.16, amount: 302, date: '2026-03-25', status: 'received', recordDate: '2026-03-23', exDate: '2026-03-24', year: 2026 },
  ];

  for (const d of dividendsData) {
    await prisma.dividend.create({
      data: {
        ...d,
        userId: user.id,
        date: new Date(d.date),
        recordDate: d.recordDate ? new Date(d.recordDate) : null,
        exDate: d.exDate ? new Date(d.exDate) : null,
      },
    });
  }

  // 创建目标
  await prisma.goal.create({
    data: {
      id: 'goal-1',
      userId: user.id,
      targetMonthly: 5000,
      isActive: true,
    },
  });

  // 创建里程碑
  const milestonesData = [
    { id: 'ms-1', type: 'first_dividend', title: '第一笔分红到账', description: '2025年6月18日 · 工商银行 +234元', status: 'done', achievedAt: '2025-06-18' },
    { id: 'ms-2', type: 'monthly_1000', title: '月收息破千', description: '2025年9月达成', status: 'done', achievedAt: '2025-09-01' },
    { id: 'ms-3', type: 'goal_50', title: '目标达成 50%', description: '2026年2月达成 · 月收息 2,500元', status: 'done', achievedAt: '2026-02-01' },
    { id: 'ms-4', type: 'goal_75', title: '目标达成 75%', description: '月收息达到 3,750 元', status: 'next', achievedAt: null },
    { id: 'ms-5', type: 'goal_100', title: '目标全部达成', description: '月均股息 ≥ 5,000元', status: 'locked', achievedAt: null },
  ];

  for (const m of milestonesData) {
    await prisma.milestone.create({
      data: {
        ...m,
        userId: user.id,
        achievedAt: m.achievedAt ? new Date(m.achievedAt) : null,
      },
    });
  }

  console.log('种子数据已成功插入！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
