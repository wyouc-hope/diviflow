import { NextRequest, NextResponse } from 'next/server';
import { getDividends, getMonthDividends } from '@/lib/db';

// 获取分红记录
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const status = searchParams.get('status');

  if (year && month) {
    const dividends = await getMonthDividends(Number(year), Number(month) - 1);
    return NextResponse.json(dividends);
  }

  const dividends = await getDividends({
    year: year ? Number(year) : undefined,
    status: status ?? undefined,
  });

  return NextResponse.json(dividends);
}
