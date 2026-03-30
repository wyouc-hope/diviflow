import { NextResponse } from 'next/server';
import { getUser, getDividendStats, getStocks } from '@/lib/db';

// 获取用户信息
export async function GET() {
  const [user, stats, stocks] = await Promise.all([
    getUser(),
    getDividendStats(),
    getStocks(),
  ]);

  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  // 计算加入天数
  const joinDays = Math.floor(
    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return NextResponse.json({
    ...user,
    joinDays,
    totalDividends: stats.totalReceived,
    stockCount: stocks.length,
    memberExpiry: user.memberExpiry?.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  });
}
