import { NextRequest, NextResponse } from 'next/server';
import { getStocks, createStock, deleteStock } from '@/lib/db';

// 获取所有持仓
export async function GET() {
  const stocks = await getStocks();
  return NextResponse.json(stocks);
}

// 添加持仓
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, code, shares, costPrice, currentPrice, dividendYield, color, shortName } = body;

  if (!name || !code || !shares || !shortName) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
  }

  const stock = await createStock({
    name,
    code,
    shares: Number(shares),
    costPrice: costPrice ? Number(costPrice) : undefined,
    currentPrice: currentPrice ? Number(currentPrice) : undefined,
    dividendYield: dividendYield ? Number(dividendYield) : undefined,
    color,
    shortName,
  });

  return NextResponse.json(stock, { status: 201 });
}

// 删除持仓
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: '缺少 id 参数' }, { status: 400 });
  }

  await deleteStock(id);
  return NextResponse.json({ success: true });
}
