import { NextRequest, NextResponse } from 'next/server';
import { getActiveGoal, setGoal, getMilestones, getDividendStats } from '@/lib/db';

// 获取目标与进度数据
export async function GET() {
  const [goal, milestones, stats] = await Promise.all([
    getActiveGoal(),
    getMilestones(),
    getDividendStats(),
  ]);

  const targetMonthly = goal?.targetMonthly ?? 5000;
  const progress = Math.round((stats.currentMonthly / targetMonthly) * 100);

  return NextResponse.json({
    goal,
    milestones,
    stats,
    progress,
  });
}

// 设置/更新目标
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { targetMonthly } = body;

  if (!targetMonthly || targetMonthly <= 0) {
    return NextResponse.json({ error: '目标金额必须大于 0' }, { status: 400 });
  }

  const goal = await setGoal(Number(targetMonthly));
  return NextResponse.json(goal, { status: 201 });
}
