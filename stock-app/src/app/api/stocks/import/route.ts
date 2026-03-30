import { NextRequest, NextResponse } from 'next/server';
import { importStocks } from '@/lib/db';

// CSV 批量导入持仓
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { stocks } = body;

  if (!Array.isArray(stocks) || stocks.length === 0) {
    return NextResponse.json({ error: '无效的导入数据' }, { status: 400 });
  }

  // 验证每条记录必填字段
  for (const stock of stocks) {
    if (!stock.name || !stock.code || !stock.shares || !stock.shortName) {
      return NextResponse.json(
        { error: `股票 ${stock.code || '未知'} 缺少必填字段` },
        { status: 400 }
      );
    }
  }

  const results = await importStocks(stocks);
  return NextResponse.json({
    success: true,
    imported: results.length,
    stocks: results,
  });
}
